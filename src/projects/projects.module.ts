import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project, ProjectMember } from './entities';
import { TeamsModule } from '../teams/teams.module';

@Module({
    imports: [TypeOrmModule.forFeature([Project, ProjectMember]), TeamsModule],
    controllers: [ProjectsController],
    providers: [ProjectsService],
    exports: [ProjectsService],
})
export class ProjectsModule { }
