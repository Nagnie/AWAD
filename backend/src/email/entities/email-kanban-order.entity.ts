import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('email_kanban_orders')
@Index(['userId', 'columnId', 'emailId'], { unique: true })
@Index(['userId', 'columnId', 'order'])
export class EmailKanbanOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  emailId: string;

  @Column()
  columnId: string;

  @Column({ type: 'float' })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
