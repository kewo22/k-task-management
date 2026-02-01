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
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, AddProjectMemberDto } from './dto';
import { JwtAuthGuard } from '../common/guards';
import { Project, ProjectMember } from './entities';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new project' })
    create(@Body() dto: CreateProjectDto): Promise<Project> {
        return this.projectsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all projects' })
    findAll(): Promise<Project[]> {
        return this.projectsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get project by ID with tasks and members' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Project> {
        const project = await this.projectsService.findById(id);
        if (!project) {
            throw new Error(`Project with ID ${id} not found`);
        }
        return project;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update project' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateProjectDto,
    ): Promise<Project> {
        return this.projectsService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete project (soft delete)' })
    remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.projectsService.remove(id);
    }

    @Post(':id/members')
    @ApiOperation({ summary: 'Add member to project' })
    addMember(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: AddProjectMemberDto,
    ): Promise<ProjectMember> {
        return this.projectsService.addMember(id, dto);
    }

    @Get(':id/members')
    @ApiOperation({ summary: 'Get project members' })
    getMembers(@Param('id', ParseUUIDPipe) id: string): Promise<ProjectMember[]> {
        return this.projectsService.getProjectMembers(id);
    }

    @Delete(':id/members/:userId')
    @ApiOperation({ summary: 'Remove member from project' })
    removeMember(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('userId', ParseUUIDPipe) userId: string,
    ): Promise<void> {
        return this.projectsService.removeMember(id, userId);
    }
}
