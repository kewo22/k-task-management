import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        const secret = configService.get<string>('jwt.refreshSecret') ?? 'default-refresh-secret';
        const options: StrategyOptionsWithRequest = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
            passReqToCallback: true,
        };
        super(options);
    }

    async validate(req: Request, payload: JwtPayload) {
        const refreshToken = req.get('Authorization')?.replace('Bearer ', '').trim();

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }

        const user = await this.usersService.findById(payload.sub);

        if (!user || user.refreshToken !== refreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        return user;
    }
}
