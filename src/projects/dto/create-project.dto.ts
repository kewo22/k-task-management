import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from '../../common/enums';

export class CreateProjectDto {
    @ApiProperty({ example: 'Website Redesign' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiPropertyOptional({ example: 'A complete redesign of the company website' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 'website-redesign' })
    @IsString()
    @IsNotEmpty()
    slug!: string;

    @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsOptional()
    @IsUUID()
    teamId?: string;

    @ApiPropertyOptional({ enum: ProjectStatus })
    @IsOptional()
    @IsEnum(ProjectStatus)
    status?: ProjectStatus;

    @ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ example: '2024-12-31T23:59:59.999Z' })
    @IsOptional()
    @IsDateString()
    endDate?: string;
}
