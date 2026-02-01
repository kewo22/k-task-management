import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamDto {
    @ApiProperty({ example: 'Engineering Team' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiPropertyOptional({ example: 'The main engineering team' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 'engineering-team' })
    @IsString()
    @IsNotEmpty()
    slug!: string;
}
