import * as bcrypt from 'bcrypt'
import {
  EntityManager, getConnection, MigrationInterface,
  QueryRunner
} from 'typeorm'

import { UserRole } from '../modules/user-role/user-role.entity'
import { User } from '../modules/user/user.entity'

export class User1552889242558 implements MigrationInterface {

  public async up (queryRunner: QueryRunner): Promise<any> {
    const bcryptHash = Number(process.env.BCRYPT_HASH)
    const manager = new EntityManager(getConnection(), queryRunner)
    const adminRole = await manager.findOneOrFail(UserRole, {
      where: {
        name: 'admin'
      }
    })

    const adminUser: User = {
      id: 1,
      email: 'admin@domain.tld',
      username: 'admin',
      password: '',
      fullName: 'Administrator',
      roleId: adminRole.id,
      isActive: true
    } as User

    let usersData: User[] = [
      adminUser
    ]

    if (process.env.NODE_ENV === 'test') {
      const disabledRole = await manager.findOneOrFail(UserRole, {
        where: {
          name: 'disabled-user-role'
        }
      })
      const testingPassword = await bcrypt.hash('testing', bcryptHash)

      adminUser.password = testingPassword
      usersData.push({
        id: 2,
        email: 'testing@domain.tld',
        username: 'disabled-user',
        password: testingPassword,
        roleId: disabledRole.id,
        fullName: 'Disabled User',
        isActive: false
      } as User)
    } else {
      adminUser.password = await bcrypt.hash('admin', bcryptHash)
    }

    await manager.save(User, usersData)
  }

  public async down (queryRunner: QueryRunner): Promise<any> {
    await queryRunner.clearTable('User')
  }
}
