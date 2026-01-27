import { Controller, Get } from '@nestjs/common';
import { BeverageService } from './beverage.service';

@Controller('beverages')
export class BeverageController {
  constructor(private beverageService: BeverageService) {}

  @Get()
  getAll() {
    return this.beverageService.getAll();
  }
}
