import { IAuthData, IAuthUserData } from '@/modules/auth/auth.interface'

import { userMock } from './user'
import { userRoleMock } from './user-role'

export const authDataMock: IAuthData = {
  id: userMock.id,
  fullName: userMock.fullName,
  roles: userRoleMock.name
}
