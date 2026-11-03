import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import UsersApiClient from './usersApiClient'
import config from '../config'

describe('UsersApiClient', () => {
  let usersApiClient: UsersApiClient

  beforeEach(() => {
    const mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    usersApiClient = new UsersApiClient(mockAuthenticationClient)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('updates a user with PUT /users/{id}', async () => {
    const saved = { userId: 5, username: 'alex2', email: 'alex2@example.com', createdAt: '2026-01-01T10:00:00Z' }
    nock(config.apis.exampleApi.url)
      .put('/users/5', { username: 'alex2', email: 'alex2@example.com' })
      .reply(200, saved)

    const response = await usersApiClient.updateUser(5, { username: 'alex2', email: 'alex2@example.com' })

    expect(response).toEqual(saved)
  })

  it('deletes a user with DELETE /users/{id}', async () => {
    const deleteCall = nock(config.apis.exampleApi.url).delete('/users/5').reply(204)

    await usersApiClient.deleteUser(5)

    expect(deleteCall.isDone()).toBe(true)
  })
})
