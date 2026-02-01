import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { TaskStatus, TaskPriority } from '../../common/enums';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

@Entity('tasks')
export class Task extends BaseEntity {
    @Column()
    title!: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ name: 'project_id' })
    projectId!: string;

    @Column({ name: 'assignee_id', nullable: true })
    assigneeId?: string;

    @Column({ name: 'creator_id' })
    creatorId!: string;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.TODO,
    })
    status!: TaskStatus;

    @Column({
        type: 'enum',
        enum: TaskPriority,
        default: TaskPriority.NONE,
    })
    priority!: TaskPriority;

    @Column({ name: 'due_date', type: 'timestamp', nullable: true })
    dueDate?: Date;

    @Column({ default: 0 })
    position!: number;

    @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project!: Project;

    @ManyToOne(() => User, (user) => user.assignedTasks, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'assignee_id' })
    assignee?: User;

    @ManyToOne(() => User, (user) => user.createdTasks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'creator_id' })
    creator!: User;
}
