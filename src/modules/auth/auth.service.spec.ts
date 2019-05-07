import { authDataMock } from '@/shared/mocks/auth'
import { crudRepositoryMock, queryBuilderMock } from '@/shared/mocks/repository'
import { userMock } from '@/shared/mocks/user'
import { userRoleMock } from '@/shared/mocks/user-role'
import { ForbiddenException, UnauthorizedException } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'

import { User } from '../user/user.entity'
import { IRequestUserData } from './auth.interface'
import { AuthService } from './auth.service'
import { jwtModuleOptions } from './constants/jwt-module.constants'
import { passportModuleOptions } from './constants/passport-module.constants'
import { JwtStrategy } from './strategies/jwt.strategy'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register(passportModuleOptions),
        JwtModule.register(jwtModuleOptions)
      ],
      providers: [
        AuthService,
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: crudRepositoryMock
        }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  describe('Validate', () => {
    it('should throw UnauthorizedException when user is undefined', () => {
      jest.spyOn<any, any>(service, '_validateUserStatus')
        .mockImplementationOnce(() => { throw new UnauthorizedException() })

      return expect(service.validate({ id: userMock.id }))
        .rejects.toBeInstanceOf(UnauthorizedException)
    })

    it('should throw ForbiddenException when user is disabled', () => {
      jest.spyOn<any, any>(service, '_validateUserStatus')
        .mockImplementationOnce(() => { throw new ForbiddenException() })

      return expect(service.validate({ id: userMock.id }))
        .rejects.toBeInstanceOf(ForbiddenException)
    })

    it('should return id and roles when user is found', () => {
      const expected: IRequestUserData = {
        id: userMock.id,
        roles: userRoleMock.name
      }

      jest.spyOn(queryBuilderMock, 'getRawOne')
        .mockImplementationOnce(async () => expected)

      jest.spyOn<any, any>(service, '_validateUserStatus')
        .mockImplementationOnce(() => true)

      return expect(service.validate({ id: userMock.id }))
        .resolves.toEqual(expected)
    })
  })

  describe('Login', () => {
    it(
      'When username/email and password is valid, should return token',
      () => {
        const expected = {
          token: 'TOKEN STRING'
        }

        jest.spyOn(bcrypt, 'compare')
          .mockImplementationOnce(async () => true)

        jest.spyOn(service.jwtService, 'signAsync')
          .mockImplementationOnce(async () => expected.token)

        jest.spyOn(queryBuilderMock, 'getRawOne')
          .mockImplementationOnce(async () => ({ ...userMock, isActive: true }))

        return expect(service.login(
          'username',
          {
            identifier: userMock.username,
            password: userMock.password
          }
        )).resolves.toEqual(expected)
      }
    )

    it(
      'When password is invalid, should throw UnauthorizedException',
      () => {
        const body = {
          ...userMock,
          isActive: true,
          password: 'invalid-password'
        }

        jest.spyOn(queryBuilderMock, 'getRawOne')
          .mockImplementationOnce(async () => body)

        jest.spyOn(bcrypt, 'compare')
          .mockImplementationOnce(async () => false)

        return expect(service.login(
          'username',
          {
            identifier: body.username,
            password: body.password
          }
        )).rejects.toBeInstanceOf(UnauthorizedException)
      }
    )

    it('When user is disabled, should throw ForbiddenException', () => {
      jest.spyOn(queryBuilderMock, 'getRawOne')
        .mockImplementationOnce(async () => ({ ...userMock, isActive: false }))

      return expect(service.login(
        'username',
        {
          identifier: 'disabled-username-or-email',
          password: 'password'
        }
      )).rejects.toBeInstanceOf(ForbiddenException)
    })
  })

  describe('Validate', () => {
    it('should return id and roles', () => {
      const expected: IRequestUserData = {
        id: 1,
        roles: userRoleMock.name
      }

      jest.spyOn(service, 'validate')
        .mockImplementation(async () => expected)

      return expect(service.validate({ id: userMock.id }))
        .resolves.toEqual(expected)
    })

    it(
      'When user is not found, should throw UnauthorizedException',
      () => {
        jest.spyOn(queryBuilderMock, 'getRawOne')
          .mockImplementationOnce(async () => undefined)

        return expect(service.validate({ id: 0 }))
          .rejects.toBeInstanceOf(UnauthorizedException)
      }
    )

    it('When user disabled, should throw ForbiddenException', () => {
      jest.spyOn(queryBuilderMock, 'getRawOne')
        .mockImplementationOnce(async () => ({
          isActive: false
        }))

      return expect(service.validate({ id: userMock.id }))
        .rejects.toBeInstanceOf(ForbiddenException)
    })
  })

  describe('Get data', () => {
    it(
      'When authorization is not valid, should throw UnauthorizedException',
      () => expect(service.getData('BEARD 123'))
        .rejects.toBeInstanceOf(UnauthorizedException)
    )

    it(
      'When bearer authorization is valid but user is disabled, should throw ForbiddenException',
      () => {
        jest.spyOn(service.jwtService, 'verifyAsync')
          .mockImplementationOnce(async () => ({ id: authDataMock.id }))

        jest.spyOn(queryBuilderMock, 'getRawOne')
          .mockImplementationOnce(async () => ({
            ...authDataMock,
            isActive: false
          }))

        return expect(service.getData('Bearer VALID_TOKEN_WITH_DISABLED_USER'))
          .rejects.toBeInstanceOf(ForbiddenException)
      }
    )

    it(
      'When bearer authorization is invalid, should throw UnauthorizedExceptionn',
      () => {
        jest.spyOn(service.jwtService, 'verifyAsync')
          .mockImplementationOnce(
            async () => { throw new UnauthorizedException() }
          )

        return expect(service.getData('Bearer INVALID_TOKEN'))
          .rejects.toBeInstanceOf(UnauthorizedException)
      }
    )
    it(
      'When bearer authorization is valid, should return user data',
      () => {
        const expected = authDataMock

        jest.spyOn(service.jwtService, 'verifyAsync')
          .mockImplementationOnce(async () => ({ id: expected.id }))

        jest.spyOn(queryBuilderMock, 'getRawOne')
          .mockImplementationOnce(async () => ({ ...expected, isActive: true }))

        return expect(service.getData('Bearer ASD')).resolves.toEqual(expected)
      }
    )
  })
})
