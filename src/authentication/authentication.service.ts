import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserRepository } from './repository/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { SessionsRepository } from './repository/sessions.repository';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);
  private readonly saltRounds = 12;
  private readonly EXPIRATION_TIME = 60 * 60 * 1000; // 10 minutes

  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionsRepository,
  ) {}

  async login(loginData: LoginDto) {
    const { email, password } = loginData;

    // Validate user credentials
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.sessionRepository.deleteExpiredSessions(
      user.id,
      this.EXPIRATION_TIME,
    );

    const access_token = this.generateToken(user.id);

    await this.sessionRepository.deleteByUserId(user.id);

    const session = await this.sessionRepository.create({
      user: user,
      token: access_token,
    });

    return { access_token: session.token };
  }

  private async validateUser(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    return user;
  }

  async register(data: RegisterDto) {
    this.logger.log(`Registering new user with email: ${data.email}`);

    await this.ensureUserDoesNotExist(data.email);
    const hashedPassword = await this.hashPassword(data.password);

    try {
      const createdUser = await this.userRepository.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
      });

      this.logger.log(`User created successfully: ${createdUser.id}`);

      return {
        access_token: this.generateToken(createdUser.id),
      };
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Error creating user. Please try again later.',
      );
    }
  }

  private async ensureUserDoesNotExist(email: string) {
    this.logger.debug(`Checking if user exists with email: ${email}`);
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      this.logger.warn(`User with email ${email} already exists.`);
      throw new BadRequestException('User already exists.');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    this.logger.debug('Hashing user password.');
    return await bcrypt.hash(password, this.saltRounds);
  }

  private generateToken(id: string): string {
    this.logger.debug(`Generating JWT token for user ID: ${id}`);
    return this.jwtService.sign({ id });
  }
}
