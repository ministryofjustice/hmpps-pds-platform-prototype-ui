import UsersApiClient, { CreateUserRequest } from '../data/usersApiClient'

export default class UsersService {
  constructor(private readonly usersApiClient: UsersApiClient) {}

  getUsers() {
    return this.usersApiClient.getUsers()
  }

  createUser(user: CreateUserRequest) {
    return this.usersApiClient.createUser(user)
  }
}
