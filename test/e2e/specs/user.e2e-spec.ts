import { HttpStatus } from '@nestjs/common'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '../../../src/modules/user/user.module'

describe('Auth', () => {
  let app: NestFastifyApplication

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        UserModule
      ]
    }).compile()

    app = module.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    )
    await app.init()
  })

  it('create user', () => {
    return app.inject({
      method: 'POST',
      payload: {
        email: 'tester@domain.tld',
        username: 'tester',
        password: 'tester',
        fullName: 'Tester'
      },
      url: '/user'
    }).then(({ statusCode }) => {
      expect(statusCode).toBe(HttpStatus.OK)
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
