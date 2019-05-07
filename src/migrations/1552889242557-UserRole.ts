import { createQueryBuilder, MigrationInterface, QueryRunner } from 'typeorm'

import { UserRole } from '../modules/user-role/user-role.entity'

export class UserRole1552889242557 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<any> {
    const data = [
      {
        name: 'admin',
        isActive: true
      }
    ] as UserRole[]

    if (process.env.NODE_ENV === 'test') {
      data.push({
        name: 'disabled-user-role',
        isActive: false
      } as UserRole)
    }

    await createQueryBuilder(UserRole)
      .setQueryRunner(queryRunner)
      .insert()
      .values(data)
      .execute()
  }

  public async down (queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0')
    await queryRunner.clearTable('UserRole')
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1')
  }
}
