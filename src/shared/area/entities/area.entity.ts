import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('province')
export class ProvinceEntity {
  /** 名称 */
  @Column({ nullable: true })
  name: string;

  /** code */
  @PrimaryColumn()
  code: string;
}

@Entity('city')
export class CityEntity {
  /** 名称 */
  @Column({ nullable: true })
  name: string;

  /** code */
  @PrimaryColumn()
  code: string;

  /** 省code */
  @Column({ nullable: true })
  provinceCode: string;
}

@Entity('area')
export class AreaEntity {
  /** 名称 */
  @Column({ nullable: true })
  name: string;

  /** code */
  @PrimaryColumn()
  code: string;

  /** 省code */
  @Column({ nullable: true })
  provinceCode: string;

  /** 市code */
  @Column({ nullable: true })
  cityCode: string;
}
