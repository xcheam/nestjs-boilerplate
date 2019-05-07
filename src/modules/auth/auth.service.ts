import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'

import { UserRole } from '../user-role/user-role.entity'
import { User } from '../user/user.entity'
import { AuthBody } from './auth.dto'
import { IAuthData, IJwtpayload, IRequestUserData, TAuthIdentifier } from './auth.interface'

@Injectable()
export class AuthService {
  constructor (
    readonly jwtService: JwtService,
    @InjectRepository(User)
    readonly userRepo: Repository<User>
  ) { }

  async validate (payload: IJwtpayload): Promise<IRequestUserData> {
    const user = await this._userQueryBuilderInnerJoinRole()
      .select([
        'Role.name AS roles',
        '(User.is_active AND Role.is_active) AS isActive'
      ])
      .whereInIds(payload.id)
      .getRawOne()

    this._validateUserStatus(user)

    return {
      id: payload.id,
      roles: user.roles
    }
  }

  async getData (authorization: string): Promise<IAuthData> {
    let jwtPayload: IJwtpayload
    const bearerPattern = 'BEARER '

    if (authorization.slice(0, bearerPattern.length)
      .toUpperCase() === bearerPattern) {
      const key = authorization.slice(bearerPattern.length)

      try {
        jwtPayload = await this.jwtService.verifyAsync(key)
      } catch {
        throw new UnauthorizedException()
      }
    } else {
      throw new UnauthorizedException()
    }

    const user = await this._userQueryBuilderInnerJoinRole()
      .select([
        'User.fullName',
        'Role.name AS roles',
        '(User.is_active AND Role.is_active) AS isActive'
      ])
      .whereInIds(jwtPayload.id)
      .getRawOne()

    this._validateUserStatus(user)

    return {
      id: jwtPayload.id,
      roles: user.roles,
      fullName: user.fullName
    }
  }

  async login (identifierType: TAuthIdentifier, data: AuthBody) {
    const user: User = await this._userQueryBuilderInnerJoinRole()
      .select([
        'User.id AS id',
        'User.password AS password',
        '(User.is_active AND Role.is_active) as isActive'
      ])
      .where(`${identifierType} = :identifier`)
      .setParameter('identifier', data.identifier)
      .getRawOne()

    this._validateUserStatus(user)

    if (await bcrypt.compare(data.password, user.password) === false) {
      throw new UnauthorizedException()
    }

    return {
      token: await this.jwtService.signAsync({
        id: user.id
      })
    }
  }

  /**
   * Check user is defined and "user.isActive".
   * if user is null or undefined, then throw UnauthorizedException.
   * if user.isActive is falsy
   * @param user
   */
  private _validateUserStatus (user: User | null | undefined): void {
    if (user == null) throw new UnauthorizedException()
    if (!user.isActive) throw new ForbiddenException()
  }

  private _userQueryBuilderInnerJoinRole () {
    return this.userRepo.createQueryBuilder()
      .innerJoin(UserRole, 'Role', 'User.role_id = Role.id')
  }
}
