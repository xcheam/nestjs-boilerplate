import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from '../user/user.entity'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { jwtModuleOptions } from './constants/jwt-module.constants'
import { passportModuleOptions } from './constants/passport-module.constants'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User
    ]),
    PassportModule.register(passportModuleOptions),
    JwtModule.register(jwtModuleOptions)
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports: [
    PassportModule,
    AuthService
  ]
})
export class AuthModule { }
