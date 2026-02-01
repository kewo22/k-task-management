import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    IsDateString,
    IsInt,
    Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../../common/enums';

export class CreateTaskDto {
    @ApiProperty({ example: 'Implement user authentication' })
    @IsString()
    @IsNotEmpty()
    title!: string;

    @ApiPropertyOptional({ example: 'Add JWT-based authentication to the API' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    @IsNotEmpty()
    projectId!: string;

    @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsOptional()
    @IsUUID()
    assigneeId?: string;

    @ApiPropertyOptional({ enum: TaskStatus })
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @ApiPropertyOptional({ enum: TaskPriority })
    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;

    @ApiPropertyOptional({ example: '2024-12-31T23:59:59.999Z' })
    @IsOptional()
    @IsDateString()
    dueDate?: string;

    @ApiPropertyOptional({ example: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    position?: number;
}
