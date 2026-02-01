import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService, TokenPair } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { JwtAuthGuard, JwtRefreshGuard } from '../common/guards';
import { CurrentUser } from '../common/decorators';
import { User } from '../users/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    async register(@Body() dto: RegisterDto): Promise<TokenPair> {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login with email and password' })
    async login(@Body() dto: LoginDto): Promise<TokenPair> {
        return this.authService.login(dto);
    }

    @Post('refresh')
    @UseGuards(JwtRefreshGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Refresh access token using refresh token' })
    async refresh(@CurrentUser() user: User): Promise<TokenPair> {
        return this.authService.refresh(user);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Logout and invalidate refresh token' })
    async logout(@CurrentUser('id') userId: string): Promise<void> {
        return this.authService.logout(userId);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    getProfile(@CurrentUser() user: User): User {
        return user;
    }
}
