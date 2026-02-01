import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto, UpdateTeamDto, AddTeamMemberDto } from './dto';
import { JwtAuthGuard } from '../common/guards';
import { Team, TeamMember } from './entities';

@ApiTags('Teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new team' })
    create(@Body() dto: CreateTeamDto): Promise<Team> {
        return this.teamsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all teams' })
    findAll(): Promise<Team[]> {
        return this.teamsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get team by ID with members' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Team> {
        const team = await this.teamsService.findById(id);
        if (!team) {
            throw new Error(`Team with ID ${id} not found`);
        }
        return team;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update team' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateTeamDto,
    ): Promise<Team> {
        return this.teamsService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete team (soft delete)' })
    remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.teamsService.remove(id);
    }

    @Post(':id/members')
    @ApiOperation({ summary: 'Add member to team' })
    addMember(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: AddTeamMemberDto,
    ): Promise<TeamMember> {
        return this.teamsService.addMember(id, dto);
    }

    @Get(':id/members')
    @ApiOperation({ summary: 'Get team members' })
    getMembers(@Param('id', ParseUUIDPipe) id: string): Promise<TeamMember[]> {
        return this.teamsService.getTeamMembers(id);
    }

    @Delete(':id/members/:userId')
    @ApiOperation({ summary: 'Remove member from team' })
    removeMember(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('userId', ParseUUIDPipe) userId: string,
    ): Promise<void> {
        return this.teamsService.removeMember(id, userId);
    }
}
