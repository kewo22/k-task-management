import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectMember } from './entities';
import { CreateProjectDto, UpdateProjectDto, AddProjectMemberDto } from './dto';
import { TeamsService } from '../teams/teams.service';
import { ProjectRole } from '../common/enums';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private readonly projectsRepository: Repository<Project>,
        @InjectRepository(ProjectMember)
        private readonly projectMembersRepository: Repository<ProjectMember>,
        private readonly teamsService: TeamsService,
    ) { }

    async create(dto: CreateProjectDto): Promise<Project> {
        const existingProject = await this.projectsRepository.findOne({
            where: { slug: dto.slug },
        });

        if (existingProject) {
            throw new ConflictException('Project with this slug already exists');
        }

        const project = this.projectsRepository.create(dto);
        const savedProject = await this.projectsRepository.save(project);

        // If team is assigned, add all team members as project members
        if (dto.teamId) {
            await this.syncTeamMembers(savedProject.id, dto.teamId);
        }

        return savedProject;
    }

    async findAll(): Promise<Project[]> {
        return this.projectsRepository.find({
            relations: ['team', 'members', 'members.user'],
        });
    }

    async findById(id: string): Promise<Project | null> {
        return this.projectsRepository.findOne({
            where: { id },
            relations: ['team', 'members', 'members.user', 'tasks'],
        });
    }

    async update(id: string, dto: UpdateProjectDto): Promise<Project> {
        const project = await this.findById(id);

        if (!project) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }

        if (dto.slug && dto.slug !== project.slug) {
            const existingProject = await this.projectsRepository.findOne({
                where: { slug: dto.slug },
            });

            if (existingProject) {
                throw new ConflictException('Project with this slug already exists');
            }
        }

        // If team is being assigned/changed, sync members
        if (dto.teamId && dto.teamId !== project.teamId) {
            await this.syncTeamMembers(id, dto.teamId);
        }

        Object.assign(project, dto);
        return this.projectsRepository.save(project);
    }

    async remove(id: string): Promise<void> {
        const project = await this.findById(id);

        if (!project) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }

        await this.projectsRepository.softDelete(id);
    }

    async addMember(
        projectId: string,
        dto: AddProjectMemberDto,
    ): Promise<ProjectMember> {
        const project = await this.findById(projectId);

        if (!project) {
            throw new NotFoundException(`Project with ID ${projectId} not found`);
        }

        const existingMember = await this.projectMembersRepository.findOne({
            where: { projectId, userId: dto.userId },
        });

        if (existingMember) {
            throw new ConflictException('User is already a member of this project');
        }

        const member = this.projectMembersRepository.create({
            projectId,
            userId: dto.userId,
            role: dto.role,
        });

        return this.projectMembersRepository.save(member);
    }

    async removeMember(projectId: string, userId: string): Promise<void> {
        const member = await this.projectMembersRepository.findOne({
            where: { projectId, userId },
        });

        if (!member) {
            throw new NotFoundException('Project member not found');
        }

        await this.projectMembersRepository.softDelete(member.id);
    }

    async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
        return this.projectMembersRepository.find({
            where: { projectId },
            relations: ['user'],
        });
    }

    private async syncTeamMembers(
        projectId: string,
        teamId: string,
    ): Promise<void> {
        const teamMembers = await this.teamsService.getTeamMembers(teamId);

        for (const teamMember of teamMembers) {
            const existingMember = await this.projectMembersRepository.findOne({
                where: { projectId, userId: teamMember.userId },
            });

            if (!existingMember) {
                const projectMember = this.projectMembersRepository.create({
                    projectId,
                    userId: teamMember.userId,
                    role: ProjectRole.MEMBER,
                });

                await this.projectMembersRepository.save(projectMember);
            }
        }
    }
}
