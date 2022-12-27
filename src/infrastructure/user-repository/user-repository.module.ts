import { Module } from '@nestjs/common';
import { UserRepositoryPort } from 'src/infrastructure/user-repository';
import { UserRepositoryAdapter } from 'src/infrastructure/user-repository/user-repository.adapter';

@Module({
  providers: [{ provide: UserRepositoryPort, useClass: UserRepositoryAdapter }],
  exports: [UserRepositoryPort],
})
export class UserRepositoryModule {}
