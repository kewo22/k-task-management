import {
    Controller,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { JwtAuthGuard } from '../common/guards';
import { User } from './entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
        const user = await this.usersService.findById(id);
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        return user;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update user' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateUserDto,
    ): Promise<User> {
        return this.usersService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete user (soft delete)' })
    remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.usersService.remove(id);
    }
}
