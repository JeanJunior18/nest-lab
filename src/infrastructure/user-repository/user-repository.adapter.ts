import { UserRepositoryPort } from 'src/infrastructure/user-repository/user-repository.port';
import { User } from 'src/user/entities';

export class UserRepositoryAdapter implements UserRepositoryPort {
  create: (data: Partial<User>) => Promise<User>;
  findByUserName: (username: string) => Promise<User>;
}
