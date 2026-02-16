import { BadRequestException, Body, Controller, Headers, Param, Post, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiHeader } from '@nestjs/swagger';
import { UploadService, PresignContext } from './upload.service';
import { PresignUploadDto } from './dto/presign-upload.dto';

@ApiTags('Admin – Upload')
@Controller('admin/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('presign/:context')
  @ApiOperation({
    summary: 'Get presigned upload URLs (bucket og sti sættes i backend)',
    description: `
**Flow:**
1. Kald dette endpoint med \`context\` (beverage-images, user-profile eller category-icons). Bucket og mappesti bestemmes i backend.
2. For hver slot: upload fil med **PUT** til \`uploadUrl\`, body = fil, header \`Content-Type: image/jpeg\` (eller png/gif/webp).
3. Brug den returnerede \`url\` for hver slot når du opretter entiteten (Beverage/User/Category) med \`images: [ { url, type } ]\`.

Presigned URLs udløber efter 15 minutter (kan overstyres med \`expiresInSeconds\`).
    `,
  })
  @ApiParam({
    name: 'context',
    enum: ['beverage-images', 'user-profile', 'category-icons'],
    description: 'Upload-type – backend vælger bucket og mappesti',
  })
  @ApiHeader({
    name: 'X-Test-Bucket',
    required: false,
    description: 'Valgfri bucket (fx til test) – opretter ny bucket med public policy hvis den ikke findes',
  })
  @ApiBody({ type: PresignUploadDto })
  @ApiResponse({
    status: 201,
    description: 'Presigned URLs oprettet',
    schema: {
      type: 'object',
      properties: {
        uploads: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              uploadUrl: { type: 'string', description: 'PUT fil til denne URL' },
              url: { type: 'string', description: 'Brug denne URL i images[] ved oprettelse' },
              key: { type: 'string' },
              type: { type: 'string', enum: ['THUMBNAIL', 'LARGE', 'PROFILE', 'ICON'] },
              width: { type: 'number', description: 'Bredde (px) – brug ved oprettelse' },
              height: { type: 'number', description: 'Højde (px) – brug ved oprettelse' },
              bucket: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Ugyldig request eller bucket findes ikke' })
  async presign(
    @Param('context') contextParam: string,
    @Body() dto: PresignUploadDto,
    @Headers('x-test-bucket') bucketOverride?: string,
  ) {
    const validContexts = Object.values(PresignContext);
    if (!validContexts.includes(contextParam as PresignContext)) {
      throw new BadRequestException(
        `context skal være én af: ${validContexts.join(', ')}`,
      );
    }
    const context = contextParam as PresignContext;
    const uploads = await this.uploadService.createPresignedUploadsForContext(
      context,
      dto.uploads.map((u) => ({
        type: u.type,
        width: u.width,
        height: u.height,
      })),
      dto.expiresInSeconds,
      bucketOverride,
    );
    return { uploads };
  }

  @Get('cleanup-expired-pending')
  @ApiOperation({
    summary: 'Kør cleanup af udløbne PendingUploads (test)',
    description:
      'Sletter udløbne PendingUpload-rækker fra DB og de tilhørende objekter fra S3. Samme job som cron kører hver 12. time. Returnerer antal slettede.',
  })
  @ApiResponse({ status: 200, description: 'Cleanup kørt', schema: { type: 'object', properties: { ok: { type: 'boolean' }, deleted: { type: 'number' } } } })
  async cleanupExpiredPending() {
    const result = await this.uploadService.cleanupExpiredPendingUploads();
    return { ok: true, deleted: result.deleted };
  }

  @Get('cron-jobs')
  @ApiOperation({
    summary: 'Liste over planlagte cron-jobs',
    description:
      'Returnerer oversigt over alle cron-jobs (schedule, beskrivelse). Matcher @Cron-dekoratorerne i UploadService.',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste over cron-jobs',
    schema: {
      type: 'object',
      properties: {
        jobs: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              schedule: { type: 'string', description: 'Cron-udtryk (min time dag måned ugedag)' },
              description: { type: 'string' },
              enabled: { type: 'boolean', description: 'Om jobbet kører (evt. betinget af env)' },
            },
          },
        },
      },
    },
  })
  getCronJobs() {
    const testEmptyBucketsEnabled = process.env.CRON_EMPTY_BUCKETS_EVERY_2MIN === 'true';
    return {
      jobs: [
        {
          id: 'cleanup-expired-pending',
          name: 'Cleanup udløbne PendingUploads',
          schedule: '0 */12 * * *',
          scheduleHuman: 'Hver 12. time (00:00, 12:00)',
          description: 'Sletter udløbne PendingUpload-rækker og tilhørende objekter i S3.',
          enabled: true,
        },
        {
          id: 'weekly-empty-buckets',
          name: 'Slet tomme buckets',
          schedule: '0 3 * * 0',
          scheduleHuman: 'Hver søndag kl. 03:00',
          description: 'Sletter tomme S3-buckets (undtagen maanslogen-dev).',
          enabled: true,
        },
        {
          id: 'test-empty-buckets-2min',
          name: 'Slet tomme buckets (test)',
          schedule: '*/2 * * * *',
          scheduleHuman: 'Hver 2. minut',
          description: 'Kun aktiv når CRON_EMPTY_BUCKETS_EVERY_2MIN=true. Til test.',
          enabled: testEmptyBucketsEnabled,
        },
      ],
    };
  }

  @Get('cleanup-empty-buckets')
  @ApiOperation({
    summary: 'Slet tomme buckets (test)',
    description:
      'Kører sletning af tomme S3/MinIO-buckets med det samme. Returnerer rapport: hvilke buckets der blev slettet, hvilke der springes over (default / har objekter), og evt. fejl.',
  })
  @ApiResponse({ status: 200, description: 'Cleanup kørt med rapport' })
  async cleanupEmptyBuckets() {
    const report = await this.uploadService.deleteEmptyBucketsReport();
    return {
      ok: true,
      message: 'Cleanup kørt',
      protectedBucket: report.protectedBucket,
      bucketsListed: report.bucketsListed,
      deleted: report.deleted,
      skippedProtected: report.skippedProtected,
      hadObjects: report.hadObjects,
      multipartAborted: report.multipartAborted,
      errors: report.errors,
    };
  }
}
