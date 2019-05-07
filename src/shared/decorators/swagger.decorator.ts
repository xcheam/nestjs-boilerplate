import { ApiResponse } from '@nestjs/swagger'
import { HttpStatus } from '@nestjs/common'

const unauthorizedApiResponse = ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Require authorization'
})
const forbiddenApiResponse = ApiResponse({
  status: HttpStatus.FORBIDDEN,
  description: 'Authorization forbidden'
})

export function DefaultAuthorizedApiResponse () {
  return (target: any, key: any, descriptor: any) => {
    unauthorizedApiResponse(target, key, descriptor)
    forbiddenApiResponse(target, key, descriptor)
  }
}
