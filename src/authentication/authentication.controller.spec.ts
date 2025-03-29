import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { UserRepository } from './repository/user.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let authenticationService: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret', // Provide a mock secret for testing
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [AuthenticationController], // Register the controller here
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
        },
        {
          provide: AuthenticationService,
          useValue: {
            register: jest.fn().mockResolvedValue({ access_token: 'mocked-jwt-token' }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    authenticationService = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call AuthenticationService.register and return an access token', async () => {
      const registerDto: RegisterDto = { name: "Amr", email: 'test@example.com', password: 'password123' };
      
      const result = await controller.register(registerDto);

      expect(authenticationService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual({ access_token: 'mocked-jwt-token' });
    });
  });
});
