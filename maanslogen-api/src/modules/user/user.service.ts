import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.user.findMany({
      include: { images: true },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { images, ...userData } = createUserDto;
    return this.prisma.user.create({
      data: {
        ...userData,
        ...(images?.length
          ? { images: { create: images.map((img) => ({ url: img.url, type: img.type })) } }
          : {}),
      },
      include: { images: true },
    });
  }
}
