import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('email_snoozes')
@Index(['userId', 'isRestored'])
@Index(['snoozeUntil', 'isRestored'])
export class EmailSnooze {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  emailId: string;

  @Column()
  threadId: string;

  @Column()
  originalColumn: string;

  @Column({ type: 'timestamp' })
  snoozeUntil: Date;

  @Column({ default: false })
  isRestored: boolean;

  @Column({ type: 'timestamp', nullable: true })
  restoredAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
