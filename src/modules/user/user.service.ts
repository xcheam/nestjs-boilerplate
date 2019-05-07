import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RestfulOptions } from '@nestjsx/crud'
import { RepositoryService } from '@nestjsx/crud/typeorm'
import { Repository } from 'typeorm'

import { User } from './user.entity'

@Injectable()
export class UserService extends RepositoryService<User> {
  protected options: RestfulOptions = {
    exclude: [
      'password'
    ]
  }

  constructor (
    @InjectRepository(User)
    repo: Repository<User>
  ) {
    super(repo)
  }
}
