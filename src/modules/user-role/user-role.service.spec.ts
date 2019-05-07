import { crudRepositoryMock } from '@/shared/mocks/repository'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { UserRole } from './user-role.entity'
import { UserRoleService } from './user-role.service'

describe('UserRoleService', () => {
  let service: UserRoleService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRoleService,
        {
          provide: getRepositoryToken(UserRole),
          useValue: crudRepositoryMock
        }
       ]
    }).compile()

    service = module.get<UserRoleService>(UserRoleService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
