import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { TeamRole } from '../../common/enums';
import { User } from '../../users/entities/user.entity';
import { Team } from './team.entity';

@Entity('team_members')
export class TeamMember extends BaseEntity {
    @Column({ name: 'user_id' })
    userId!: string;

    @Column({ name: 'team_id' })
    teamId!: string;

    @Column({
        type: 'enum',
        enum: TeamRole,
        default: TeamRole.MEMBER,
    })
    role!: TeamRole;

    @CreateDateColumn({ name: 'joined_at' })
    joinedAt!: Date;

    @ManyToOne(() => User, (user) => user.teamMemberships, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Team, (team) => team.members, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'team_id' })
    team!: Team;
}
