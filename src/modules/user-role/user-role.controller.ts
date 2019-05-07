import { Controller } from '@nestjs/common'

import { UserRole } from './user-role.entity'
import { UserRoleService } from './user-role.service'
import { Crud } from '@nestjsx/crud'

@Crud(UserRole, {
  validation: {
    validationError: {
      target: false,
      value: false
    }
  }
})
@Controller('user-role')
export class UserRoleController {
  constructor (
    public service: UserRoleService
  ) {
  }
}
