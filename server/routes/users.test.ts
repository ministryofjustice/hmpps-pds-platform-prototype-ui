import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'
import UsersService from '../services/usersService'
import UsersApiClient from '../data/usersApiClient'

jest.mock('../services/usersService')

const usersService = new UsersService({} as UsersApiClient) as jest.Mocked<UsersService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({ services: { usersService } })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /users', () => {
  it('shows existing users in a table', () => {
    usersService.getUsers.mockResolvedValue([
      { userId: 1, username: 'alex', email: 'alex@example.com', createdAt: '2026-01-01T10:00:00Z' },
    ])

    return request(app)
      .get('/users')
      .expect(res => {
        expect({ status: res.status, body: res.status === 200 ? 'ok' : res.text }).toEqual({ status: 200, body: 'ok' })
        expect(res.text).toContain('alex@example.com')
        expect(res.text).toContain('Add user')
      })
  })
})

describe('POST /users', () => {
  it('creates the user and redirects back to the list', () => {
    usersService.createUser.mockResolvedValue({
      userId: 1,
      username: 'alex',
      email: 'alex@example.com',
      createdAt: '2026-01-01T10:00:00Z',
    })

    return request(app)
      .post('/users')
      .send({ username: 'alex', email: 'alex@example.com' })
      .expect(302)
      .expect('Location', '/users')
      .expect(() => {
        expect(usersService.createUser).toHaveBeenCalledWith({ username: 'alex', email: 'alex@example.com' })
      })
  })
})
