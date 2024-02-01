import {
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

export abstract class CommonEntity {
  // 主键id
  @PrimaryGeneratedColumn('uuid')
  id: number;

  // 创建时间
  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createTime: Date;

  // 更新时间
  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updateTime: Date;

  // 软删除
  @Column({ default: false })
  isDelete: boolean;
}
