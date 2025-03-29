import { Controller, Post, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  register(@Body() registerDto: RegisterDto) {
    return this.authenticationService.register(registerDto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login and get an access token' })
  @ApiResponse({ status: 200, description: 'Successful login.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  login(@Body() loginDto: LoginDto) {
    return this.authenticationService.login(loginDto);
  }
}
