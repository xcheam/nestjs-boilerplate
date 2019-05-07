export interface IJwtpayload {
  id: number
}

export interface IRequestUserData extends IJwtpayload {
  roles: string
}

export interface IAuthData extends IRequestUserData {
  fullName: string,
}

export interface IAuthUserData extends IAuthData {
  isActive?: boolean
}

export interface ILoginResult {
  token: string
}

export type TAuthIdentifier = 'email'
  | 'username'
