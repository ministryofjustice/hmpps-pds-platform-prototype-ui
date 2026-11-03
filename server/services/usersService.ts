import UsersApiClient, { CreateUserRequest } from '../data/usersApiClient'

export default class UsersService {
  constructor(private readonly usersApiClient: UsersApiClient) {}

  getUsers() {
    return this.usersApiClient.getUsers()
  }

  createUser(user: CreateUserRequest) {
    return this.usersApiClient.createUser(user)
  }

  updateUser(userId: number, user: CreateUserRequest) {
    return this.usersApiClient.updateUser(userId, user)
  }

  deleteUser(userId: number) {
    return this.usersApiClient.deleteUser(userId)
  }
}
