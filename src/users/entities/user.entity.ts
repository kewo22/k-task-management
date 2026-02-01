import { Entity, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserRole } from '../../common/enums';
import { TeamMember } from '../../teams/entities/team-member.entity';
import { ProjectMember } from '../../projects/entities/project-member.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('users')
export class User extends BaseEntity {
    @Column({ unique: true })
    email!: string;

    @Column()
    @Exclude()
    password!: string;

    @Column({ name: 'first_name' })
    firstName!: string;

    @Column({ name: 'last_name' })
    lastName!: string;

    @Column({ name: 'avatar_url', nullable: true })
    avatarUrl?: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role!: UserRole;

    @Column({ name: 'refresh_token', nullable: true })
    @Exclude()
    refreshToken?: string;

    @OneToMany(() => TeamMember, (teamMember) => teamMember.user)
    teamMemberships!: TeamMember[];

    @OneToMany(() => ProjectMember, (projectMember) => projectMember.user)
    projectMemberships!: ProjectMember[];

    @OneToMany(() => Task, (task) => task.assignee)
    assignedTasks!: Task[];

    @OneToMany(() => Task, (task) => task.creator)
    createdTasks!: Task[];
}
