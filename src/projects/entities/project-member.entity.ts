import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ProjectRole } from '../../common/enums';
import { User } from '../../users/entities/user.entity';
import { Project } from './project.entity';

@Entity('project_members')
export class ProjectMember extends BaseEntity {
    @Column({ name: 'user_id' })
    userId!: string;

    @Column({ name: 'project_id' })
    projectId!: string;

    @Column({
        type: 'enum',
        enum: ProjectRole,
        default: ProjectRole.MEMBER,
    })
    role!: ProjectRole;

    @CreateDateColumn({ name: 'joined_at' })
    joinedAt!: Date;

    @ManyToOne(() => User, (user) => user.projectMemberships, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Project, (project) => project.members, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project!: Project;
}
