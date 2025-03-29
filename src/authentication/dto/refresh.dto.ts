import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
  @ApiProperty({
    description: "The user's refresh token",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}
