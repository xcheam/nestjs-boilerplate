import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { IJwtpayload, IRequestUserData } from '../auth.interface'
import { AuthService } from '../auth.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor (
    readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    })
  }

  validate (payload: IJwtpayload): Promise<IRequestUserData> {
    return this.authService.validate(payload)
  }
}
