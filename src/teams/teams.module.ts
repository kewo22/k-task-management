import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { Team, TeamMember } from './entities';

@Module({
    imports: [TypeOrmModule.forFeature([Team, TeamMember])],
    controllers: [TeamsController],
    providers: [TeamsService],
    exports: [TeamsService],
})
export class TeamsModule { }
