import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { ImageType } from '../../common/dto/create-image.dto';
import { PrismaService } from '../../prisma/prisma.service';

export interface PresignSlot {
  type: ImageType;
}

export interface PresignResult {
  uploadUrl: string;
  url: string;
  key: string;
  type: ImageType;
  bucket: string;
}

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
export class MinioService {
  private readonly client: S3Client;
  private readonly defaultBucket: string;
  private readonly endpointBaseUrl: string;

  constructor(private readonly prisma: PrismaService) {
    const endpoint = process.env.MINIO_ENDPOINT;
    const useSSL = process.env.MINIO_USE_SSL;
    this.defaultBucket = process.env.MINIO_BUCKET ?? 'maanslogen-test';

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
   * Safe to use because bucket/keyPrefix are backend-controlled per context.
   */
  async ensureBucket(bucket?: string): Promise<void> {
    const b = bucket ?? this.defaultBucket;
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: b }));
    } catch {
      await this.client.send(new CreateBucketCommand({ Bucket: b }));
    }
  }

  /**
   * Presigned uploads for a given context – bucket og keyPrefix sættes i backend.
   */
  async createPresignedUploadsForContext(
    context: PresignContext,
    slots: PresignSlot[],
    expiresInSeconds = 900,
  ): Promise<PresignResult[]> {
    const config = PRESIGN_CONTEXT_CONFIG[context];
    return this.createPresignedUploads(slots, {
      bucket: config.bucket,
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

    for (const slot of slots) {
      const key = `${keyPrefix}/${randomUUID()}`;
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
   * Parses a full object URL (e.g. http://minio:9000/bucket/images/uuid) into bucket and key.
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
}
