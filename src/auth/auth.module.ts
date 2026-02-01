import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy, JwtRefreshStrategy } from './strategies';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService): JwtModuleOptions => {
                const expiresIn = configService.get<string>('jwt.expiresIn') ?? '15m';
                return {
                    secret: configService.get<string>('jwt.secret') ?? 'default-secret',
                    signOptions: {
                        expiresIn: expiresIn as any,
                    },
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
    exports: [AuthService],
})
export class AuthModule { }
