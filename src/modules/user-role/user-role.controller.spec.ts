import { crudRepositoryMock } from '@/shared/mocks/repository'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { UserRoleController } from './user-role.controller'
import { UserRole } from './user-role.entity'
import { UserRoleService } from './user-role.service'

describe('UserRole Controller', () => {
  let controller: UserRoleController

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UserRoleController
      ],
      providers: [
        UserRoleService,
        {
          provide: getRepositoryToken(UserRole),
          useValue: crudRepositoryMock
        }
      ]
    }).compile()

    controller = module.get<UserRoleController>(UserRoleController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
