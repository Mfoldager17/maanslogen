import { BadRequestException, Body, Controller, Headers, Param, Post } from '@nestjs/common';
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
}
