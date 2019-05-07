import { UseGuards, SetMetadata } from '@nestjs/common'
import { JwtRolesAuthGuard } from '@/modules/auth/guards/jwt-roles.guard'
import { ApiBearerAuth } from '@nestjs/swagger'

const jwtRolesAuthGuards = UseGuards(JwtRolesAuthGuard)
const apiBearerAuth = ApiBearerAuth()

export function JwtRolesGuard (roles: string[]): any {
  return (target: any, key: any, descriptor: any) => {
    if (process.env.NODE_ENV !== 'test') {
      apiBearerAuth(target, key, descriptor)
    }
    jwtRolesAuthGuards(target, key, descriptor)
    SetMetadata('roles', roles)(target, key, descriptor)
  }
}
