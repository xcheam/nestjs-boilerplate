import { IRequestUserData } from '../../../src/modules/auth/auth.interface'
import { HttpStatus } from '@nestjs/common'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from '../../../src/modules/auth/auth.module'
import { auth, getJwtAuthorization, getReservedUser } from '../helpers/auth'

describe('Auth', () => {
  let app: NestFastifyApplication

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        AuthModule
      ]
    }).compile()

    app = module.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    )
    await app.init()
  })

  describe('Login', () => {
    describe('With username/email and password', () => {
      it('status should be 401 Unauthorized ', () => {
        return auth(app, {
          identifier: '12345',
          password: '12345'
        }).then(({ statusCode }) => {
          expect(statusCode).toBe(HttpStatus.UNAUTHORIZED)
        })
      })

      it('status should be 400 Bad Request', () => {
        return auth(app, {
          identifier: 'abcd',
          password: ''
        }).then(({ statusCode }) => {
          expect(statusCode).toBe(HttpStatus.BAD_REQUEST)
        })
      })

      it('status should be 403 Forbidden', () => {
        return auth(app, getReservedUser('disabled-user'))
          .then(({ statusCode }) => {
            expect(statusCode).toBe(HttpStatus.FORBIDDEN)
          })
      })
    })

    describe('With username and password', () => {
      it('should give token', () => {
        return auth(app, getReservedUser('admin'))
          .then(({ statusCode, payload }) => {
            expect(statusCode).toBe(HttpStatus.CREATED)
            expect(typeof JSON.parse(payload).token).toBe('string')
          })
      })
    })

    describe('With email and password', () => {
      it('should give token', () => {
        return auth(app, getReservedUser('admin', 'email'))
          .then(({ statusCode, payload }) => {
            expect(statusCode).toBe(HttpStatus.CREATED)
            expect(typeof JSON.parse(payload).token).toBe('string')
          })
      })
    })
  })

  describe('Get data', () => {
    it('should give id and roles', async () => {
      return app.inject({
        method: 'GET',
        url: '/auth/data',
        headers: {
          authorization: await getJwtAuthorization(app, 'admin')
        }
      }).then(({ statusCode, payload }) => {
        expect(statusCode).toBe(HttpStatus.OK)
        const { id, roles } = JSON.parse(payload) as IRequestUserData

        expect(typeof id).toBe('number')
        expect(typeof roles).toBe('string')
      })
    })

    it('status should be 401 Unauthorized', () => {
      return app.inject({
        method: 'GET',
        url: '/auth/data'
      }).then(({ statusCode }) => {
        expect(statusCode).toBe(HttpStatus.UNAUTHORIZED)
      })
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
