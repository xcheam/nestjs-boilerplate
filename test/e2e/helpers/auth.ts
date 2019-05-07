import { AuthBody } from '@/modules/auth/auth.dto'
import { TAuthIdentifier } from '@/modules/auth/auth.interface'
import { HttpStatus } from '@nestjs/common'
import { NestFastifyApplication } from '@nestjs/platform-fastify'

type IReservedUser = 'admin'
  | 'disabled-user'

export function auth (app: NestFastifyApplication, { identifier, password }: AuthBody) {
  return app.inject({
    method: 'POST',
    url: '/auth',
    payload: { identifier, password }
  })
}

export function getReservedUser (
  user: IReservedUser,
  type: TAuthIdentifier = 'username'
): AuthBody {
  let identifier: string | undefined

  switch (user) {
    case 'admin':
      identifier = 'admin'
      break

    case 'disabled-user':
      identifier = 'disabled-user'
      break

    default:
      throw new Error('identifier is not in reserved user')
  }

  return {
    identifier: type === 'email' ? `${identifier}@domain.tld` : identifier,
    password: 'testing'
  }

}

export async function retrieveJwtToken (
  app: NestFastifyApplication,
  params: AuthBody | IReservedUser
) {
  if (typeof params === 'string') {
    params = getReservedUser(params)
  }

  const response = await auth(app, params)
  expect(response.statusCode).toBe(HttpStatus.CREATED)

  const body = JSON.parse(response.payload)
  expect(typeof body.token).toBe('string')

  return body.token
}

export async function getJwtAuthorization (
  app: NestFastifyApplication,
  params: AuthBody | IReservedUser
) {
  const token = await retrieveJwtToken(app, params)
  return `Bearer ${token}`
}
