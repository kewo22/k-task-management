import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ProjectStatus } from '../../common/enums';
import { Team } from '../../teams/entities/team.entity';
import { ProjectMember } from './project-member.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('projects')
export class Project extends BaseEntity {
    @Column()
    name!: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ unique: true })
    slug!: string;

    @Column({ name: 'team_id', nullable: true })
    teamId?: string;

    @Column({
        type: 'enum',
        enum: ProjectStatus,
        default: ProjectStatus.BACKLOG,
    })
    status!: ProjectStatus;

    @Column({ name: 'start_date', type: 'timestamp', nullable: true })
    startDate?: Date;

    @Column({ name: 'end_date', type: 'timestamp', nullable: true })
    endDate?: Date;

    @ManyToOne(() => Team, (team) => team.projects, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'team_id' })
    team?: Team;

    @OneToMany(() => ProjectMember, (projectMember) => projectMember.project)
    members!: ProjectMember[];

    @OneToMany(() => Task, (task) => task.project)
    tasks!: Task[];
}
