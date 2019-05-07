import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Post,
  UnauthorizedException,
  ValidationPipe
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { isEmail } from 'validator'

import { AuthBody } from './auth.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor (
    readonly authService: AuthService
  ) { }

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Authentication success'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid authentication'
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Username blocked'
  })
  auth (
    @Body(ValidationPipe) body: AuthBody
  ) {
    if (typeof body.identifier === 'string') {
      if (isEmail(body.identifier)) {
        return this.authService.login('email', body)
      } else if (body.identifier.length >= 5 && body.identifier.length <= 60) {
        return this.authService.login('username', body)
      }
    }

    throw new BadRequestException('Identifer must be a valid username or email')
  }

  @Get('/data')
  async getData (
    @Headers('authorization') authorization: string | null | undefined
  ) {
    if (authorization == null) throw new UnauthorizedException()
    return this.authService.getData(authorization)
  }
}
