import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserRepositoryModule } from 'src/infrastructure/user-repository';
import { CreateUserDto, GetUserDto } from 'src/user/dto';
import { AccessLevel } from 'src/user/entities';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import supertest from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserRepositoryModule],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: 'user-id-1',
              name: 'John Bullard Doe',
              username: 'john.doe@nestjs.com',
              accessLevel: AccessLevel.STANDARD,
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should not fail DTO', async () => {
    const userDto: CreateUserDto = {
      name: 'John Doe',
      username: 'john.dow@nestjs.com',
      password: 'John12345',
    };

    const dtoObj = plainToInstance(CreateUserDto, userDto);
    const errors = await validate(dtoObj);

    expect(errors).toHaveLength(0);
  });

  it('should reject invalid email in username', async () => {
    const userDto: CreateUserDto = {
      name: 'John Doe',
      username: 'john.dow@nestjs',
      password: 'John12345',
    };

    const dtoObj = plainToInstance(CreateUserDto, userDto);
    const errors = await validate(dtoObj);
    expect(errors).toHaveLength(1);
  });

  it('should reject invalid DTO', async () => {
    const userDto: CreateUserDto = {
      name: '',
      username: null,
      password: undefined,
    };

    const dtoObj = plainToInstance(CreateUserDto, userDto);
    const errors = await validate(dtoObj);
    expect(errors).toHaveLength(3);
  });

  it('should accept request and create user', async () => {
    const result = await supertest(app.getHttpServer()).post('/user').send({
      name: 'John Bullard Doe',
      username: 'john.doe@nestjs.com',
      password: 'myPassword',
    });

    expect(result.status).toBe(201);
    expect(result.body).toHaveProperty('id');
    expect(result.body).toHaveProperty('accessLevel');
  });

  it('should transform username to lower Case', async () => {
    const userDto = {
      name: 'John Bullard Doe',
      username: 'JOHN.DOES.doe@nestjs.com',
      password: 'myPassword',
    };

    jest.spyOn(service, 'create').mockResolvedValue({
      ...plainToInstance(CreateUserDto, userDto),
      id: 'test-id',
      accessLevel: AccessLevel.STANDARD,
    });
    const result = await supertest(app.getHttpServer())
      .post('/user')
      .send(userDto);

    expect(result.status).toBe(201);
    expect((result.body as GetUserDto).username).toEqual(
      userDto.username.toLowerCase(),
    );
  });
});
