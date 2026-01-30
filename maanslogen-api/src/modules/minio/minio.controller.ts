import { Body, Controller, Param, ParseEnumPipe, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { MinioService, PresignContext } from './minio.service';
import { PresignUploadDto } from './dto/presign-upload.dto';

@ApiTags('MinIO')
@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

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
              bucket: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Ugyldig request eller bucket findes ikke' })
  async presign(
    @Param('context', new ParseEnumPipe({ enum: PresignContext })) context: PresignContext,
    @Body() dto: PresignUploadDto,
  ) {
    const uploads = await this.minioService.createPresignedUploadsForContext(
      context,
      dto.uploads.map((u) => ({ type: u.type })),
      dto.expiresInSeconds,
    );
    return { uploads };
  }
}
