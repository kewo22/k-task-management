import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) { }

    async create(dto: CreateTaskDto, creatorId: string): Promise<Task> {
        const task = this.tasksRepository.create({
            ...dto,
            creatorId,
        });

        return this.tasksRepository.save(task);
    }

    async findAll(projectId?: string): Promise<Task[]> {
        const query = this.tasksRepository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.assignee', 'assignee')
            .leftJoinAndSelect('task.creator', 'creator')
            .leftJoinAndSelect('task.project', 'project')
            .orderBy('task.position', 'ASC');

        if (projectId) {
            query.where('task.projectId = :projectId', { projectId });
        }

        return query.getMany();
    }

    async findById(id: string): Promise<Task | null> {
        return this.tasksRepository.findOne({
            where: { id },
            relations: ['assignee', 'creator', 'project'],
        });
    }

    async update(id: string, dto: UpdateTaskDto): Promise<Task> {
        const task = await this.findById(id);

        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        Object.assign(task, dto);
        return this.tasksRepository.save(task);
    }

    async remove(id: string): Promise<void> {
        const task = await this.findById(id);

        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        await this.tasksRepository.softDelete(id);
    }

    async findByAssignee(userId: string): Promise<Task[]> {
        return this.tasksRepository.find({
            where: { assigneeId: userId },
            relations: ['project', 'creator'],
            order: { position: 'ASC' },
        });
    }

    async reorder(taskId: string, newPosition: number): Promise<Task> {
        const task = await this.findById(taskId);

        if (!task) {
            throw new NotFoundException(`Task with ID ${taskId} not found`);
        }

        task.position = newPosition;
        return this.tasksRepository.save(task);
    }
}
