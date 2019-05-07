import { JwtModuleOptions } from '@nestjs/jwt'

export const jwtModuleOptions: JwtModuleOptions = {
  secretOrPrivateKey: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN
  }
}
