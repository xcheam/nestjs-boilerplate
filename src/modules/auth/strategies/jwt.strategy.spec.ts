import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { crudRepositoryMock } from '../../../shared/mocks/repository'
import { User } from '../..//user/user.entity'
import { AuthService } from '../auth.service'
import { jwtModuleOptions } from '../constants/jwt-module.constants'
import { passportModuleOptions } from '../constants/passport-module.constants'
import { JwtStrategy } from './jwt.strategy'
import { Strategy } from 'passport-jwt'
import { userMock } from '@/shared/mocks/user'
import { IRequestUserData } from '../auth.interface'
import { userRoleMock } from '@/shared/mocks/user-role'

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy

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

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy)
  })

  describe('Validate', () => {
    it('When payload is valid, should return ', async () => {
      const expected: IRequestUserData = {
        id: userMock.id,
        roles: userRoleMock.name
      }

      jest.spyOn(jwtStrategy.authService, 'validate')
        .mockImplementationOnce(async () => expected)

      expect(await jwtStrategy.validate({ id: userMock.id })).toEqual(expected)
    })
  })
})
