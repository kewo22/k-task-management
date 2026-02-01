import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { JwtAuthGuard } from '../common/guards';
import { CurrentUser } from '../common/decorators';
import { Task } from './entities/task.entity';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new task' })
    create(
        @Body() dto: CreateTaskDto,
        @CurrentUser('id') userId: string,
    ): Promise<Task> {
        return this.tasksService.create(dto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all tasks, optionally filter by project' })
    @ApiQuery({ name: 'projectId', required: false })
    findAll(@Query('projectId') projectId?: string): Promise<Task[]> {
        return this.tasksService.findAll(projectId);
    }

    @Get('my-tasks')
    @ApiOperation({ summary: 'Get tasks assigned to current user' })
    getMyTasks(@CurrentUser('id') userId: string): Promise<Task[]> {
        return this.tasksService.findByAssignee(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get task by ID' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
        const task = await this.tasksService.findById(id);
        if (!task) {
            throw new Error(`Task with ID ${id} not found`);
        }
        return task;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update task' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateTaskDto,
    ): Promise<Task> {
        return this.tasksService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete task (soft delete)' })
    remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.tasksService.remove(id);
    }
}
