import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team, TeamMember } from './entities';
import { CreateTeamDto, UpdateTeamDto, AddTeamMemberDto } from './dto';

@Injectable()
export class TeamsService {
    constructor(
        @InjectRepository(Team)
        private readonly teamsRepository: Repository<Team>,
        @InjectRepository(TeamMember)
        private readonly teamMembersRepository: Repository<TeamMember>,
    ) { }

    async create(dto: CreateTeamDto): Promise<Team> {
        const existingTeam = await this.teamsRepository.findOne({
            where: { slug: dto.slug },
        });

        if (existingTeam) {
            throw new ConflictException('Team with this slug already exists');
        }

        const team = this.teamsRepository.create(dto);
        return this.teamsRepository.save(team);
    }

    async findAll(): Promise<Team[]> {
        return this.teamsRepository.find({
            relations: ['members', 'members.user'],
        });
    }

    async findById(id: string): Promise<Team | null> {
        return this.teamsRepository.findOne({
            where: { id },
            relations: ['members', 'members.user', 'projects'],
        });
    }

    async update(id: string, dto: UpdateTeamDto): Promise<Team> {
        const team = await this.findById(id);

        if (!team) {
            throw new NotFoundException(`Team with ID ${id} not found`);
        }

        if (dto.slug && dto.slug !== team.slug) {
            const existingTeam = await this.teamsRepository.findOne({
                where: { slug: dto.slug },
            });

            if (existingTeam) {
                throw new ConflictException('Team with this slug already exists');
            }
        }

        Object.assign(team, dto);
        return this.teamsRepository.save(team);
    }

    async remove(id: string): Promise<void> {
        const team = await this.findById(id);

        if (!team) {
            throw new NotFoundException(`Team with ID ${id} not found`);
        }

        await this.teamsRepository.softDelete(id);
    }

    async addMember(teamId: string, dto: AddTeamMemberDto): Promise<TeamMember> {
        const team = await this.findById(teamId);

        if (!team) {
            throw new NotFoundException(`Team with ID ${teamId} not found`);
        }

        const existingMember = await this.teamMembersRepository.findOne({
            where: { teamId, userId: dto.userId },
        });

        if (existingMember) {
            throw new ConflictException('User is already a member of this team');
        }

        const member = this.teamMembersRepository.create({
            teamId,
            userId: dto.userId,
            role: dto.role,
        });

        return this.teamMembersRepository.save(member);
    }

    async removeMember(teamId: string, userId: string): Promise<void> {
        const member = await this.teamMembersRepository.findOne({
            where: { teamId, userId },
        });

        if (!member) {
            throw new NotFoundException('Team member not found');
        }

        await this.teamMembersRepository.softDelete(member.id);
    }

    async getTeamMembers(teamId: string): Promise<TeamMember[]> {
        return this.teamMembersRepository.find({
            where: { teamId },
            relations: ['user'],
        });
    }
}
