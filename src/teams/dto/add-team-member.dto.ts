import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TeamRole } from '../../common/enums';

export class AddTeamMemberDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    @IsNotEmpty()
    userId!: string;

    @ApiProperty({ enum: TeamRole, example: TeamRole.MEMBER })
    @IsEnum(TeamRole)
    role!: TeamRole;
}
