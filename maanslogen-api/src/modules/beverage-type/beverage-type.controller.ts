import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BeverageTypeService } from './beverage-type.service';
import { CreateBeverageTypeDto } from './dto/create-beverage-type.dto';

@Controller('beverage-types')
export class BeverageTypeController {
  constructor(private service: BeverageTypeService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  create(@Body() createBeverageTypeDto: CreateBeverageTypeDto) {
    return this.service.create(createBeverageTypeDto);
  }
}
