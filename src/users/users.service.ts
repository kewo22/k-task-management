import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    async create(dto: CreateUserDto): Promise<User> {
        const user = this.usersRepository.create(dto);
        return this.usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findById(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async update(id: string, dto: UpdateUserDto): Promise<User> {
        const user = await this.findById(id);

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        Object.assign(user, dto);
        return this.usersRepository.save(user);
    }

    async remove(id: string): Promise<void> {
        const user = await this.findById(id);

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        await this.usersRepository.softDelete(id);
    }

    async updateRefreshToken(
        id: string,
        refreshToken: string | null,
    ): Promise<void> {
        await this.usersRepository.update(id, { refreshToken: refreshToken ?? undefined });
    }
}
