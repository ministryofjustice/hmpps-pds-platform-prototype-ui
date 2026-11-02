import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'

export interface User {
  userId: number
  username: string
  email: string
  createdAt: string
}

export interface CreateUserRequest {
  username: string
  email: string
}

export default class UsersApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Users API', config.apis.exampleApi, logger, authenticationClient)
  }

  getUsers() {
    return this.get<User[]>({ path: '/users' }, asSystem())
  }

  createUser(user: CreateUserRequest) {
    return this.post<User>({ path: '/users', data: { ...user } }, asSystem())
  }
}
