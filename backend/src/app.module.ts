import { Module, CacheModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './jwt.guard'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'
import { AssignmentModule } from './assignment/assignment.module'
import { SubmissionModule } from './submission/submission.module'
import { SubscriptionModule } from './subscription/subscription.module'
import { ClassModule } from './class/class.module'

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [],
      synchronize: process.env.NODE_ENV !== 'production',
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
    AssignmentModule,
    SubmissionModule,
    SubscriptionModule,
    ClassModule,
    PassportModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
