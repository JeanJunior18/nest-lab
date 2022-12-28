import { HttpException, Injectable, Logger } from '@nestjs/common';
import { UserRepositoryPort } from 'src/infrastructure/user-repository';
import { CreateUserDto, GetUserDto } from 'src/user/dto';
import { AccessLevel, User } from 'src/user/entities';

import { hashSync } from 'bcryptjs';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepositoryPort) {}

  async create({
    name,
    password,
    username,
  }: CreateUserDto): Promise<GetUserDto> {
    const hasUsername = await this.findByUsername(username);
    if (hasUsername) {
      const message = 'User already exists';
      this.logger.error(message);
      throw new HttpException(message, 403);
    }
    this.logger.verbose(`Creating a new user ${username}`);

    const user = new User();
    user.id = randomUUID();
    user.name = name;
    user.username = username;
    user.password = hashSync(password, 10);
    user.accessLevel = AccessLevel.STANDARD;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    await this.userRepository.create(user);

    return new GetUserDto(user);
  }

  async findByUsername(username: User['username']) {
    this.logger.verbose(`looking for user with email: ${username}`);
    const user = await this.userRepository.findByUserName(username);
    if (user) {
      this.logger.verbose(`User ${username} found`);
      return user;
    }
    this.logger.verbose(`User ${username} not found`);
  }
}
