import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { LoggedInUser } from './decorators/get-current-user';
import { User } from './entities/users.entity';
import { JwtAuthGuard } from './guards/jwtauth.guard';

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

  @Post('/refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Return the new access token and refresh token.',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid refresh token.' })
  @ApiResponse({ status: 404, description: 'user is not logged in.' })
  async refresh(@Body() body: RefreshDto) {
    return this.authenticationService.refreshToken(body.refresh_token);
  }

  @Post('/logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'logout' })
  @ApiResponse({ status: 404, description: 'user is not logged in.' })
  async logout(@Body() body: RefreshDto) {
    return this.authenticationService.logout(body.refresh_token);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/me')
  @HttpCode(200)
  @ApiOperation({ summary: 'logout' })
  @ApiResponse({ status: 404, description: 'user is not logged in.' })
  async getUserInfo(@LoggedInUser() user: Partial<User>) {
    return this.authenticationService.getUserInfo(user.id);
  }
}
