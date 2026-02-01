import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto';
import { User } from '../users/entities/user.entity';

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async register(dto: RegisterDto): Promise<TokenPair> {
        const existingUser = await this.usersService.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.usersService.create({
            ...dto,
            password: hashedPassword,
        });

        const tokens = await this.generateTokens(user);
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async login(dto: LoginDto): Promise<TokenPair> {
        const user = await this.usersService.findByEmail(dto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.generateTokens(user);
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async refresh(user: User): Promise<TokenPair> {
        const tokens = await this.generateTokens(user);
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async logout(userId: string): Promise<void> {
        await this.usersService.updateRefreshToken(userId, null);
    }

    private async generateTokens(user: User): Promise<TokenPair> {
        const payload = { sub: user.id, email: user.email };

        const jwtSecret = this.configService.get<string>('jwt.secret') ?? 'default-secret';
        const jwtExpiresIn = this.configService.get<string>('jwt.expiresIn') ?? '15m';
        const refreshSecret = this.configService.get<string>('jwt.refreshSecret') ?? 'default-refresh-secret';
        const refreshExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d';

        const accessTokenOptions: JwtSignOptions = {
            secret: jwtSecret,
            expiresIn: jwtExpiresIn as any,
        };

        const refreshTokenOptions: JwtSignOptions = {
            secret: refreshSecret,
            expiresIn: refreshExpiresIn as any,
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, accessTokenOptions),
            this.jwtService.signAsync(payload, refreshTokenOptions),
        ]);

        return { accessToken, refreshToken };
    }
}
