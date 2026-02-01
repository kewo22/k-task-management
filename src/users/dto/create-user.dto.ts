import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({ example: 'password123', minLength: 8 })
    @IsString()
    @MinLength(8)
    password!: string;

    @ApiProperty({ example: 'John' })
    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    lastName!: string;

    @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
    @IsOptional()
    @IsString()
    avatarUrl?: string;
}
