import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './jwt.guard'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'
import { ClassModule } from './class/class.module'
import { StudentModule } from './student/student.module'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { ReviewModule } from './review/review.module'
import { AdminModule } from './admin/admin.module'
import { NotiModule } from './noti/noti.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { GlobalModule } from './global/global.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [],
      synchronize: process.env.NODE_ENV !== 'production',
      autoLoadEntities: true,
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    AuthModule,
    ClassModule,
    PassportModule,
    StudentModule,
    ReviewModule,
    AdminModule,
    NotiModule,
    GlobalModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
