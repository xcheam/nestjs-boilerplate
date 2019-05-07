import { crudRepositoryMock } from '@/shared/mocks/repository'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { UserController } from './user.controller'
import { User } from './user.entity'
import { UserService } from './user.service'

describe('User Controller', () => {
  let controller: UserController

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UserController
      ],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: crudRepositoryMock
        }
      ]
    }).compile()

    controller = module.get<UserController>(UserController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
