import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/plugins';
import { UserRepositoryPort } from 'src/infrastructure/user-repository';
import { User } from 'src/user/entities';

@Injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}
  create(data: User): Promise<User> {
    return this.prismaService.user.create({
      data,
    });
  }
  findByUserName(username: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { username } });
  }
}
