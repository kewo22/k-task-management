import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { TeamMember } from './team-member.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('teams')
export class Team extends BaseEntity {
    @Column()
    name!: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ unique: true })
    slug!: string;

    @OneToMany(() => TeamMember, (teamMember) => teamMember.team)
    members!: TeamMember[];

    @OneToMany(() => Project, (project) => project.team)
    projects!: Project[];
}
