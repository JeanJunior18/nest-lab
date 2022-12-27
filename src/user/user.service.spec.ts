import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from './user.service';
import { AccessLevel } from 'src/user/entities';
import { UserRepositoryPort } from 'src/infrastructure/user-repository';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepositoryPort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UserService,
        {
          provide: UserRepositoryPort,
          useValue: {
            findByUserName: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepositoryPort>(UserRepositoryPort);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should create a user', async () => {
    const userDto: CreateUserDto = {
      name: 'John Doe',
      username: 'john.doe@nestjs.com',
      password: 'DoePassword',
    };

    jest.spyOn(repository, 'findByUserName').mockResolvedValue(null);
    const user = await service.create(userDto);

    expect(user).toHaveProperty('id');
    expect(user.name).toEqual(userDto.name);
    expect(user.username).toEqual(userDto.username);
    expect(user.accessLevel).toEqual(AccessLevel.STANDARD);
  });

  it('should not create user with email that already exists', async () => {
    const userDto: CreateUserDto = {
      name: 'John Doe',
      username: 'john.doe@nestjs.com',
      password: 'DoePassword',
    };

    jest.spyOn(repository, 'findByUserName').mockResolvedValue({
      id: 'user-id-1',
      name: 'John Bullard Doe',
      username: 'john.doe@nestjs.com',
      accessLevel: AccessLevel.STANDARD,
    });
    const createUserPromise = service.create(userDto);

    expect(createUserPromise).rejects.toEqual(new Error('User already exists'));
  });
});
