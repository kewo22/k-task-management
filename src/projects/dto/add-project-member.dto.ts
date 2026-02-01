import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectRole } from '../../common/enums';

export class AddProjectMemberDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    @IsNotEmpty()
    userId!: string;

    @ApiProperty({ enum: ProjectRole, example: ProjectRole.MEMBER })
    @IsEnum(ProjectRole)
    role!: ProjectRole;
}
