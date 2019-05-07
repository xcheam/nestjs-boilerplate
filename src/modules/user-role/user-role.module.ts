import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserRoleController } from './user-role.controller'
import { UserRole } from './user-role.entity'
import { UserRoleService } from './user-role.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRole
    ])
  ],
  controllers: [UserRoleController],
  providers: [UserRoleService]
})
export class UserRoleModule {}
