import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
  DeleteObjectCommand,
  PutBucketPolicyCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  DeleteBucketCommand,
  ListMultipartUploadsCommand,
  AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { ImageType } from '../image/dto/create-image.dto';
import { PrismaService } from '../../prisma/prisma.service';

export interface PresignSlot {
  type: ImageType;
  /** Bredde (px) – bruges i key som keyPrefix/id/widthxheight. Default per type hvis udeladt. */
  width?: number;
  /** Højde (px) – bruges i key som keyPrefix/id/widthxheight. Default per type hvis udeladt. */
  height?: number;
}

export interface PresignResult {
  uploadUrl: string;
  url: string;
  key: string;
  type: ImageType;
  width: number;
  height: number;
  bucket: string;
}

/** Bucket der aldrig slettes ved cleanup af tomme buckets (kun denne springes over). */
const PROTECTED_BUCKET_CLEANUP = 'maanslogen-dev';

/** Default dimensioner per type (width x height) når slot ikke angiver width/height. */
const DEFAULT_DIMENSIONS: Record<ImageType, { width: number; height: number }> = {
  [ImageType.THUMBNAIL]: { width: 200, height: 200 },
  [ImageType.LARGE]: { width: 800, height: 800 },
  [ImageType.PROFILE]: { width: 400, height: 400 },
  [ImageType.ICON]: { width: 64, height: 64 },
};

export interface CreatePresignedUploadsOptions {
  /** Seconds until presigned URL expires (default: 900) */
  expiresInSeconds?: number;
  /** Bucket name (default: MINIO_BUCKET env) */
  bucket?: string;
  /** Key prefix/path in bucket, e.g. "images" or "images/2024/thumbnails" (default: "images") */
  keyPrefix?: string;
}

/** Upload context – backend bestemmer bucket og keyPrefix per type. */
export enum PresignContext {
  BeverageImages = 'beverage-images',
  UserProfile = 'user-profile',
  CategoryIcons = 'category-icons',
}

const PRESIGN_CONTEXT_CONFIG: Record<
  PresignContext,
  { bucket?: string; keyPrefix: string }
> = {
  [PresignContext.BeverageImages]: { keyPrefix: 'images/beverages' },
  [PresignContext.UserProfile]: { keyPrefix: 'images/users' },
  [PresignContext.CategoryIcons]: { keyPrefix: 'images/categories' },
};

@Injectable()
export class UploadService {
  private readonly client: S3Client;
  private readonly defaultBucket: string;
  private readonly endpointBaseUrl: string;

  constructor(private readonly prisma: PrismaService) {
    const endpoint = process.env.MINIO_ENDPOINT;
    const useSSL = process.env.MINIO_USE_SSL;
    this.defaultBucket = process.env.MINIO_BUCKET ?? 'maanslogen-dev';

    const endpointUrl = `${useSSL === 'true' ? 'https' : 'http'}://${endpoint}`;
    this.endpointBaseUrl = endpointUrl.replace(/\/$/, '');
    this.client = new S3Client({
      endpoint: endpointUrl,
      region: process.env.MINIO_REGION,
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY ?? '',
        secretAccessKey: process.env.MINIO_SECRET_KEY ?? '',
      },
      forcePathStyle: true,
    });
  }

  /** Default bucket from env (MINIO_BUCKET). */
  getDefaultBucket(): string {
    return this.defaultBucket;
  }

  /** Public base URL for a bucket (e.g. for building object URLs). */
  getPublicBaseUrl(bucket?: string): string {
    const b = bucket ?? this.defaultBucket;
    const custom = process.env.MINIO_PUBLIC_URL;
    if (custom && b === this.defaultBucket) {
      return custom.replace(/\/$/, '');
    }
    return `${this.endpointBaseUrl}/${b}`;
  }

  /**
   * Ensures the bucket exists; creates it if it does not.
   * Nye buckets får public read policy (GetObject for everyone) så billed-URL'er kan åbnes.
   * Safe to use because bucket/keyPrefix are backend-controlled per context.
   */
  async ensureBucket(bucket?: string): Promise<void> {
    const b = bucket ?? this.defaultBucket;
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: b }));
    } catch {
      await this.client.send(new CreateBucketCommand({ Bucket: b }));
      await this.setBucketPublicReadPolicy(b);
    }
  }

  /**
   * Sets bucket policy to allow public read (s3:GetObject) for all objects.
   * Bruger samme format som MinIO "download" preset så Console kan vise Public i stedet for Custom.
   */
  private async setBucketPublicReadPolicy(bucket: string): Promise<void> {
    const policy = JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicRead',
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucket}/*`],
        },
      ],
    });
    try {
      await this.client.send(
        new PutBucketPolicyCommand({ Bucket: bucket, Policy: policy }),
      );
    } catch {
      // Policy may fail if MinIO has different defaults; bucket still exists
    }
  }

  /**
   * Presigned uploads for a given context – bucket og keyPrefix sættes i backend.
   * Valgfri bucketOverride (fx fra query-param til test) – bruges i stedet for context default.
   */
  async createPresignedUploadsForContext(
    context: PresignContext,
    slots: PresignSlot[],
    expiresInSeconds = 900,
    bucketOverride?: string,
  ): Promise<PresignResult[]> {
    const config = PRESIGN_CONTEXT_CONFIG[context];
    return this.createPresignedUploads(slots, {
      bucket: bucketOverride ?? config.bucket,
      keyPrefix: config.keyPrefix,
      expiresInSeconds,
    });
  }

  /**
   * Generates presigned PUT URLs for each slot. Registers each key in PendingUpload.
   * If the client never creates the entity, cleanup job will delete the object from S3.
   */
  async createPresignedUploads(
    slots: PresignSlot[],
    options: CreatePresignedUploadsOptions | number = {},
  ): Promise<PresignResult[]> {
    const opts: CreatePresignedUploadsOptions =
      typeof options === 'number' ? { expiresInSeconds: options } : options;
    const bucket = opts.bucket ?? this.defaultBucket;
    const expiresInSeconds = opts.expiresInSeconds ?? 900;
    const keyPrefix = opts.keyPrefix ?? 'images';

    await this.ensureBucket(bucket);

    const results: PresignResult[] = [];
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
    const publicBaseUrl = this.getPublicBaseUrl(bucket);
    const imageId = randomUUID();

    for (const slot of slots) {
      const dims =
        slot.width != null && slot.height != null
          ? { width: slot.width, height: slot.height }
          : DEFAULT_DIMENSIONS[slot.type];
      const sizeSegment = `${dims.width}x${dims.height}`;
      const key = `${keyPrefix}/${imageId}/${sizeSegment}`;
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const uploadUrl = await getSignedUrl(this.client, command, {
        expiresIn: expiresInSeconds,
      });

      const url = `${publicBaseUrl}/${key}`;

      await this.prisma.pendingUpload.create({
        data: { bucket, key, expiresAt },
      });

      results.push({
        uploadUrl,
        url,
        key,
        type: slot.type,
        width: dims.width,
        height: dims.height,
        bucket,
      });
    }

    return results;
  }

  /**
   * Call after creating Beverage/User/Category/Type with images. Removes those URLs from PendingUpload
   * so the cleanup job won't delete them from S3.
   */
  async confirmUploads(urls: string[]): Promise<void> {
    if (urls.length === 0) return;
    const pairs = urls
      .map((url) => this.urlToBucketAndKey(url))
      .filter((p): p is { bucket: string; key: string } => p !== null);
    if (pairs.length === 0) return;
    await this.prisma.pendingUpload.deleteMany({
      where: {
        OR: pairs.map((p) => ({ bucket: p.bucket, key: p.key })),
      },
    });
  }

  /**
   * Parses a full object URL (e.g. http://storage:9000/bucket/images/uuid) into bucket and key.
   */
  urlToBucketAndKey(url: string): { bucket: string; key: string } | null {
    try {
      const u = new URL(url);
      const path = u.pathname.replace(/^\/+/, '').split('/');
      if (path.length < 2) return null;
      const bucket = path[0];
      const key = path.slice(1).join('/');
      return { bucket, key };
    } catch {
      return null;
    }
  }

  /**
   * Registrerer billed-URL'er i PendingUpload så cleanup-jobbet sletter dem fra S3 når expiresAt er passeret.
   * Bruges fx når en beverage slettes – billederne ryddes op i bucketen uden at blive slettet med det samme.
   */
  async registerImagesForPendingCleanup(
    urls: string[],
    expiresInDays = 7,
  ): Promise<void> {
    if (urls.length === 0) return;
    const pairs = urls
      .map((url) => this.urlToBucketAndKey(url))
      .filter((p): p is { bucket: string; key: string } => p !== null);
    if (pairs.length === 0) return;
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
    for (const { bucket, key } of pairs) {
      await this.prisma.pendingUpload.upsert({
        where: {
          bucket_key: { bucket, key },
        },
        create: { bucket, key, expiresAt },
        update: { expiresAt },
      });
    }
  }

  /**
   * Deletes from S3 and DB any PendingUpload that has expired (presigned URL was never claimed).
   */
  async cleanupExpiredPendingUploads(): Promise<void> {
    const expired = await this.prisma.pendingUpload.findMany({
      where: { expiresAt: { lt: new Date() } },
    });
    for (const row of expired) {
      try {
        await this.client.send(
          new DeleteObjectCommand({ Bucket: row.bucket, Key: row.key }),
        );
      } catch {
        // Object may already be deleted or bucket missing
      }
      await this.prisma.pendingUpload.delete({ where: { id: row.id } });
    }
  }

  @Cron('0 */12 * * *') // Hver 12. time (fx 00:00 og 12:00)
  async handleScheduledCleanup(): Promise<void> {
    await this.cleanupExpiredPendingUploads();
  }

  /**
   * Afbryder alle uafsluttede multipart-uploads i en bucket (ellers blokerer de DeleteBucket).
   */
  private async abortIncompleteMultipartUploads(bucket: string): Promise<number> {
    let aborted = 0;
    let keyMarker: string | undefined;
    let uploadIdMarker: string | undefined;
    do {
      const list = await this.client.send(
        new ListMultipartUploadsCommand({
          Bucket: bucket,
          KeyMarker: keyMarker,
          UploadIdMarker: uploadIdMarker,
        }),
      );
      const uploads = list.Uploads ?? [];
      for (const u of uploads) {
        if (u.Key == null || u.UploadId == null) continue;
        try {
          await this.client.send(
            new AbortMultipartUploadCommand({
              Bucket: bucket,
              Key: u.Key,
              UploadId: u.UploadId,
            }),
          );
          aborted++;
        } catch {
          // Ignorer enkelt fejl
        }
      }
      keyMarker = list.IsTruncated ? list.NextKeyMarker : undefined;
      uploadIdMarker = list.IsTruncated ? list.NextUploadIdMarker : undefined;
    } while (keyMarker != null || uploadIdMarker != null);
    return aborted;
  }

  /**
   * Returnerer antal objekter i bucketen (tjekker alle sider).
   */
  private async getBucketObjectCount(bucket: string): Promise<number> {
    let total = 0;
    let continuationToken: string | undefined;
    do {
      const list = await this.client.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          MaxKeys: 1000,
          ContinuationToken: continuationToken,
        }),
      );
      const count = list.KeyCount ?? list.Contents?.length ?? 0;
      total += count;
      continuationToken = list.IsTruncated ? list.NextContinuationToken : undefined;
    } while (continuationToken);
    return total;
  }

  /**
   * Returnerer true hvis bucketen har 0 objekter (tjekker alle sider).
   */
  private async isBucketEmpty(bucket: string): Promise<boolean> {
    return (await this.getBucketObjectCount(bucket)) === 0;
  }

  /**
   * Rapport fra deleteEmptyBuckets – så man kan se i API-svaret hvorfor en bucket ikke blev slettet.
   */
  async deleteEmptyBucketsReport(): Promise<{
    protectedBucket: string;
    bucketsListed: string[];
    deleted: string[];
    skippedProtected: string[];
    hadObjects: { bucket: string; objectCount: number }[];
    multipartAborted: { bucket: string; count: number }[];
    errors: { bucket: string; message: string }[];
  }> {
    const report = {
      protectedBucket: PROTECTED_BUCKET_CLEANUP,
      bucketsListed: [] as string[],
      deleted: [] as string[],
      skippedProtected: [] as string[],
      hadObjects: [] as { bucket: string; objectCount: number }[],
      multipartAborted: [] as { bucket: string; count: number }[],
      errors: [] as { bucket: string; message: string }[],
    };
    let buckets: { Name?: string }[] = [];
    try {
      const result = await this.client.send(new ListBucketsCommand({}));
      buckets = result.Buckets ?? [];
      report.bucketsListed = buckets.map((b) => b.Name).filter((n): n is string => !!n);
    } catch (err) {
      report.errors.push({ bucket: '(ListBuckets)', message: (err as Error).message });
      return report;
    }
    for (const b of buckets) {
      const name = b.Name;
      if (!name) continue;
      if (name === PROTECTED_BUCKET_CLEANUP) {
        report.skippedProtected.push(name);
        continue;
      }
      try {
        const aborted = await this.abortIncompleteMultipartUploads(name);
        if (aborted > 0) report.multipartAborted.push({ bucket: name, count: aborted });
        const objectCount = await this.getBucketObjectCount(name);
        if (objectCount > 0) {
          report.hadObjects.push({ bucket: name, objectCount });
          continue;
        }
        await this.client.send(new DeleteBucketCommand({ Bucket: name }));
        report.deleted.push(name);
      } catch (err) {
        report.errors.push({ bucket: name, message: (err as Error).message });
      }
    }
    return report;
  }

  /**
   * Sletter buckets der er tomme (0 objekter). Kun "maanslogen-dev" springes over.
   * Kalder deleteEmptyBucketsReport som udfører selve sletningen.
   */
  async deleteEmptyBuckets(): Promise<void> {
    await this.deleteEmptyBucketsReport();
  }

  @Cron('0 3 * * 0') // Hver søndag kl. 03:00 (produktion)
  async handleWeeklyEmptyBucketCleanup(): Promise<void> {
    await this.deleteEmptyBuckets();
  }

  /** Kører hver 2. minut når CRON_EMPTY_BUCKETS_EVERY_2MIN=true – kun til test. */
  @Cron('*/2 * * * *')
  async handleTestEmptyBucketCleanup(): Promise<void> {
    if (process.env.CRON_EMPTY_BUCKETS_EVERY_2MIN !== 'true') return;
    await this.deleteEmptyBuckets();
  }
}
