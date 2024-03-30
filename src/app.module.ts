import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { UserModule } from './shared/user/user.module';
import { AuthModule } from './shared/auth/auth.module';
import { UploadModule } from './shared/upload/upload.module';
import { AreaModule } from './shared/area/area.module';
import { CategoryModule } from './modules/category/category.module';
import { AddressModule } from './modules/address/address.module';
import { CartModule } from './modules/cart/cart.module';
import { SkuModule } from './modules/sku/sku.module';
import { ProductModule } from './modules/product/product.module';
import { SpecificationModule } from './modules/specification/specification.module';
import { MemberModule } from './modules/member/member.module';
import { BannerModule } from './modules/banner/banner.module';
import { OrderModule } from './modules/order/order.module';
import envConfig from './utils/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局
      envFilePath: [envConfig.path],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        autoLoadEntities: true, // 自动导入实体
        // entities: [], // 数据表实体
        host: configService.get('DB_HOST', 'localhost'), // 主机，默认为localhost
        port: configService.get<number>('DB_PORT', 3306), // 端口号
        username: configService.get('DB_USER', 'root'), // 用户名
        password: configService.get('DB_PASSWORD', '123456'), // 密码
        database: configService.get('DB_DATABASE', 'blog'), //数据库名
        // timezone: '+08:00', //服务器上配置的时区
        synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
      }),
    }),
    UserModule,
    AuthModule,
    UploadModule,
    AreaModule,
    CategoryModule,
    AddressModule,
    CartModule,
    SkuModule,
    ProductModule,
    SpecificationModule,
    MemberModule,
    BannerModule,
    OrderModule,
  ],
})
export class AppModule {}
