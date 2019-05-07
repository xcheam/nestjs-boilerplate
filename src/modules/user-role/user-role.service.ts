import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RepositoryService } from '@nestjsx/crud/typeorm'

import { UserRole } from './user-role.entity'

@Injectable()
export class UserRoleService extends RepositoryService<UserRole> {
  constructor (
    @InjectRepository(UserRole)
    repo
  ) {
    super(repo)
  }
}
