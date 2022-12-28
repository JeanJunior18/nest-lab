import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/plugins';
import {
  UserRepositoryAdapter,
  UserRepositoryPort,
} from 'src/infrastructure/user-repository';

@Module({
  providers: [
    PrismaService,
    { provide: UserRepositoryPort, useClass: UserRepositoryAdapter },
  ],
  exports: [UserRepositoryPort],
})
export class UserRepositoryModule {}
