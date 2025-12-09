import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('email_priorities')
@Index(['userId', 'emailId'], { unique: true })
@Index(['userId', 'columnId', 'isPinned'])
export class EmailPriority {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  emailId: string;

  @Column()
  columnId: string;

  @Column({ default: false })
  isPinned: boolean;

  @Column({ type: 'float', nullable: true })
  pinnedOrder: number;

  @Column({ type: 'int', default: 0 })
  priorityLevel: number; // 0 = normal, 1 = high, 2 = urgent

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
