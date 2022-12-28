import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities';

@Injectable()
export abstract class UserRepositoryPort {
  abstract create: (data: Partial<User>) => Promise<User>;
  abstract findByUserName: (
    username: User['username'],
  ) => Promise<Partial<User> | null>;
}
