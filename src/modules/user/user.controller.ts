import { Controller } from '@nestjs/common'
import { Crud } from '@nestjsx/crud'

import { User } from './user.entity'
import { UserService } from './user.service'

@Crud(User, {
  validation: {
    validationError: {
      target: false,
      value: false
    }
  }
})
@Controller('user')
export class UserController {
  constructor (
    public service: UserService
  ) {
  }
}
