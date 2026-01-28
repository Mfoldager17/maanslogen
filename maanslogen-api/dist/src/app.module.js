"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./prisma/prisma.module");
const user_module_1 = require("./modules/user/user.module");
const beverage_module_1 = require("./modules/beverage/beverage.module");
const review_module_1 = require("./modules/review/review.module");
const beverage_category_module_1 = require("./modules/beverage-category/beverage-category.module");
const beverage_type_module_1 = require("./modules/beverage-type/beverage-type.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, user_module_1.UserModule, beverage_module_1.BeverageModule, review_module_1.ReviewModule, beverage_category_module_1.BeverageCategoryModule, beverage_type_module_1.BeverageTypeModule],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map