import { Module } from '@nestjs/common';
import {
  UserRepositoryAdapter,
  UserRepositoryPort,
} from 'src/infrastructure/user-repository';

@Module({
  providers: [{ provide: UserRepositoryPort, useClass: UserRepositoryAdapter }],
  exports: [UserRepositoryPort],
})
export class UserRepositoryModule {}
