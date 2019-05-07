import { userRoleMock } from './user-role'
import { User } from '@/modules/user/user.entity'

export const userMock: User = {
  id: 1,
  username: 'test123',
  email: 'test@domain.tld',
  fullName: 'tester',
  password: 'bcrypt_hashed_password',
  roleId: userRoleMock.id
}
