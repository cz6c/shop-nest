import { Entity, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from '@/common/common.entity';
import { QINIU } from '#/index';
import { FollowEntity } from '@/user/entities/follow.entity';

@Entity('map_record')
export class MapRecordEntity extends CommonEntity {
  @Column({ nullable: true })
  content: string;

  @Column({ type: 'timestamp', nullable: true })
  eventDate: Date;

  @Column({
    type: 'simple-array',
    nullable: true,
    transformer: {
      to(value) {
        return value.map((c: string) => c.replace(QINIU.DOMAIN, ''));
      },
      from(value) {
        return value
          ? value.map((c: string) => (c ? `${QINIU.DOMAIN}${c}` : ''))
          : [];
      },
    },
  })
  files: string[];

  @Column({ nullable: true })
  lng: string;

  @Column({ nullable: true })
  lat: string;

  @Column({ nullable: true })
  address: string;

  @ManyToOne(() => FollowEntity, (entity) => entity.mapRecords)
  follow: FollowEntity;
}
