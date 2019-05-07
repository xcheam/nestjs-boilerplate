import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { UserRoleModule } from './user-role/user-role.module'
@Module({
  imports: [
    TypeOrmModule.forRoot({
      keepConnectionAlive: process.env.NODE_ENV !== 'production'
    }),
    AuthModule,
    UserModule,
    UserRoleModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class ApplicationModule { }
