import { Entity, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from '@/common/common.entity';
import { FollowEntity } from '@/user/entities/follow.entity';

@Entity('memorial_day')
export class MemorialDayEntity extends CommonEntity {
  @Column({ nullable: true })
  title: string;

  @Column({ type: 'timestamp', nullable: true })
  eventDate: Date;

  @ManyToOne(() => FollowEntity, (entity) => entity.memorialDays)
  follow: FollowEntity;
}
