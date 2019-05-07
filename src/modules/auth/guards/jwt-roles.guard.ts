import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtRolesAuthGuard extends AuthGuard('jwt') {
  constructor (
    private readonly reflector: Reflector
  ) { super() }

  async canActivate (context: ExecutionContext) {
    const passed = await super.canActivate(context)
    if (passed === false) throw new UnauthorizedException()

    const allowedRoles = this.reflector.get<string[] | undefined>(
      'roles',
      context.getHandler()
    )
    if (allowedRoles === undefined) return true

    const user: { id: number, roles: string } = context
      .switchToHttp()
      .getRequest()
      .user
    const isAllowed = allowedRoles.includes(user.roles)
    return isAllowed
  }
}
