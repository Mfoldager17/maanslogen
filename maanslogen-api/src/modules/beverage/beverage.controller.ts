import { Body, Controller, Get, Post } from '@nestjs/common';
import { BeverageService } from './beverage.service';
import { CreateBeverageDto } from './dto/create-beverage.dto';

@Controller('beverages')
export class BeverageController {
  constructor(private beverageService: BeverageService) {}

  @Get()
  getAll() {
    return this.beverageService.getAll();
  }

  @Post()
  create(@Body() createBeverageDto: CreateBeverageDto) {
    return this.beverageService.create(createBeverageDto);
  }
}
