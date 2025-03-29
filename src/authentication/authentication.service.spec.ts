import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repository/user.repository';
import { RegisterDto } from './dto/register.dto';
import { User } from './entities/users.entity';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let userRepository: jest.Mocked<UserRepository>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret', // Provide a mock secret for testing
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [
        AuthenticationService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mocked-jwt-token'), 
          },
        }
      ],
      exports: [AuthenticationService],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const mockRegisterDto: RegisterDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'P@ssword123',
    };

    it('should register a new user and return a JWT token', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockResolvedValue({
        _id: '12345',
        name: mockRegisterDto.name,
        email: mockRegisterDto.email,
        password: await bcrypt.hash(mockRegisterDto.password, 12),
      } as User);
      
      const result = await service.register(mockRegisterDto);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        mockRegisterDto.email,
      );
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockRegisterDto.name,
          email: mockRegisterDto.email,
        }),
      );

      expect(result).toEqual({ access_token: 'mocked-jwt-token' });
    });

    it('should throw BadRequestException if user already exists', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue({
        _id: 'existing-id',
        name: mockRegisterDto.name,
        email: mockRegisterDto.email,
        password: await bcrypt.hash(mockRegisterDto.password, 12),
      } as User);

      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on database error', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      jest
        .spyOn(userRepository, 'create')
        .mockRejectedValue(new Error('DB Error'));

      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
