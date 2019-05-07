import { IAuthModuleOptions } from '@nestjs/passport'

export const passportModuleOptions: IAuthModuleOptions = {
  defaultStrategy: 'jwt'
}
