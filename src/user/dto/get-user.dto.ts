import { User } from 'src/user/entities';
import { AccessLevel } from 'src/user/entities';

export class GetUserDto {
  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.username = user.username;
    this.accessLevel = user.accessLevel;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  id: string;
  name: string;
  username: string;
  accessLevel: AccessLevel;
  createdAt?: Date;
  updatedAt?: Date;
}
