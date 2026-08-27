import { PartialType } from '@nestjs/swagger';
import { CreateBeverageAttributeValueDto } from './create-beverage-attribute-value.dto';

export class UpdateBeverageAttributeValueDto extends PartialType(
  CreateBeverageAttributeValueDto,
) {}
