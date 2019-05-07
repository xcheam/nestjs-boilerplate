import { QueryBuilder, SelectQueryBuilder } from 'typeorm'

const mockReturnThis = jest.fn().mockReturnThis()

export const queryBuilderMock = generateQueryBuilderMock()

export const crudRepositoryMock = {
  metadata: {
    columns: [],
    relations: []
  },
  createQueryBuilder: jest.fn(() => queryBuilderMock)
}

export function generateQueryBuilderMock (): SelectQueryBuilder<any> {
  return {
    select: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    setParameter: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    whereInIds: jest.fn().mockReturnThis()
  } as any
}
