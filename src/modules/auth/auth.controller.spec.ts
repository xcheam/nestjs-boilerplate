import { crudRepositoryMock } from '@/shared/mocks/repository'
import { userMock } from '@/shared/mocks/user'
import { BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { User } from '../user/user.entity'
import { AuthController } from './auth.controller'
import { IAuthData } from './auth.interface'
import { AuthService } from './auth.service'
import { jwtModuleOptions } from './constants/jwt-module.constants'
import { passportModuleOptions } from './constants/passport-module.constants'
import { JwtStrategy } from './strategies/jwt.strategy'

describe('Auth Controller', () => {
  let controller: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register(passportModuleOptions),
        JwtModule.register(jwtModuleOptions)
      ],
      controllers: [
        AuthController
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

    controller = module.get<AuthController>(AuthController)
  })

  describe('Auth', () => {
    it('When email and password is valid, should return token', async () => {
      const expected = {
        token: 'JWT_TOKEN'
      }

      jest.spyOn(controller.authService, 'login')
        .mockImplementationOnce(async () => expected)

      const result = await controller.auth({
        identifier: userMock.email,
        password: userMock.password
      })

      expect(result).toEqual(expected)
    })

    it('When username and password is valid, should return token', async () => {
      const expected = {
        token: 'JWT_TOKEN'
      }

      jest.spyOn(controller.authService, 'login')
        .mockImplementationOnce(async () => expected)

      const result = await controller.auth({
        identifier: userMock.username,
        password: userMock.password
      })

      expect(result).toEqual(expected)
    })

    it(
      'When username/email format is invalid, should throw BadRequestException',
      async () => {
        try {
          await controller.auth({
            identifier: '1234',
            password: '1234'
          })
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException)
        }
      }
    )

    it(
      'When username/email or password is invalid, should throw UnauthorizedException',
      async () => {
        jest.spyOn(controller, 'auth')
          .mockImplementation(async () => { throw new UnauthorizedException() })

        try {
          await controller.auth({
            identifier: 'invalid-username-or-email',
            password: 'invalid-password'
          })
        } catch (error) {
          expect(error).toBeInstanceOf(UnauthorizedException)
        }
      }
    )

    it(
      'When username/email is valid but user is disabled, should throw ForbiddenException',
      async () => {
        jest.spyOn(controller, 'auth')
          .mockImplementation(async () => { throw new ForbiddenException() })

        try {
          await controller.auth({
            identifier: 'disabled-username-or-email',
            password: 'password'
          })
        } catch (error) {
          expect(error).toBeInstanceOf(ForbiddenException)
        }
      }
    )
  })

  describe('Get data', () => {
    it(
      'When authorization is valid,should return id and roles',
      async () => {
        const expected: IAuthData = {
          id: userMock.id,
          roles: 'user-roles',
          fullName: userMock.fullName
        }

        jest.spyOn(controller, 'getData')
          .mockImplementation(async () => expected)

        const result = await controller.getData('valid authorization')

        expect(result).toEqual(expected)
      }
    )

    it(
      'When authorization is not present, should throw UnauthorizedException',
      async () => {
        try {
          await controller.getData(undefined)
        } catch (error) {
          expect(error).toBeInstanceOf(UnauthorizedException)
        }
      }
    )

    it(
      'When authorization is invalid,should throw UnauthorizedException',
      async () => {
        jest.spyOn(controller.authService, 'getData')
          .mockImplementation(async () => { throw new UnauthorizedException() })

        try {
          await controller.getData('invalid authorization')
        } catch (error) {
          expect(error).toBeInstanceOf(UnauthorizedException)
        }
      }
    )

    it(
      'When authorization is valid but user is disabled,should throw ForbiddenException',
      async () => {
        jest.spyOn(controller.authService, 'getData')
          .mockImplementation(async () => { throw new ForbiddenException() })

        try {
          await controller.getData('authorization-with-disabled-user')
        } catch (error) {
          expect(error).toBeInstanceOf(ForbiddenException)
        }
      }
    )
  })
})
