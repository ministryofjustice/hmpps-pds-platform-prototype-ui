import { Router } from 'express'

import type { Services } from '../services'
import auditSearchRequest from '../middleware/auditSearchRequest'

export enum Page {
  EXAMPLE_PAGE = 'EXAMPLE_PAGE',
  SEARCH_OFFENDERS = 'SEARCH_OFFENDERS',
}

export default function routes(services: Services): Router {
  const { auditService, exampleService, usersService } = services
  const router = Router()

  router.get('/', async (req, res, _next) => {
    await auditService.logPageView(Page.EXAMPLE_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const currentTime = await exampleService.getCurrentTime()
    return res.render('pages/index', { currentTime })
  })

  router.get('/users', async (_req, res) => {
    const users = await usersService.getUsers()
    return res.render('pages/users', { users, form: {}, errors: [] })
  })

  router.post('/users', async (req, res) => {
    const username = String(req.body.username ?? '').trim()
    const email = String(req.body.email ?? '').trim()

    const errors: { text: string; href: string }[] = []
    if (!username) errors.push({ text: 'Enter a username', href: '#username' })
    if (!email) errors.push({ text: 'Enter an email address', href: '#email' })

    if (errors.length === 0) {
      try {
        await usersService.createUser({ username, email })
        return res.redirect('/users')
      } catch (error) {
        const status = (error as { responseStatus?: number }).responseStatus
        errors.push({
          text:
            status === 409
              ? 'A user with these details already exist.'
              : 'The user could not be added. Check the details and try again.',
          href: '#username',
        })
      }
    }

    const users = await usersService.getUsers()
    return res.status(400).render('pages/users', { users, form: { username, email }, errors })
  })

  router.get('/users/:id/edit', async (req, res) => {
    const userId = Number(req.params.id)
    const users = await usersService.getUsers()
    const user = users.find(u => u.userId === userId)
    if (!user) return res.redirect('/users')

    return res.render('pages/edit-user', { user, form: { username: user.username, email: user.email }, errors: [] })
  })

  router.post('/users/:id/edit', async (req, res) => {
    const userId = Number(req.params.id)
    const username = String(req.body.username ?? '').trim()
    const email = String(req.body.email ?? '').trim()

    const errors: { text: string; href: string }[] = []
    if (!username) errors.push({ text: 'Enter a username', href: '#username' })
    if (!email) errors.push({ text: 'Enter an email address', href: '#email' })

    if (errors.length === 0) {
      try {
        await usersService.updateUser(userId, { username, email })
        return res.redirect('/users')
      } catch (error) {
        const status = (error as { responseStatus?: number }).responseStatus
        if (status === 404) return res.redirect('/users')
        errors.push({
          text:
            status === 409
              ? 'A user with these details already exists.'
              : 'The user could not be updated. Check the details and try again.',
          href: '#username',
        })
      }
    }

    return res.status(400).render('pages/edit-user', { user: { userId }, form: { username, email }, errors })
  })

  router.post('/users/:id/delete', async (req, res) => {
    const userId = Number(req.params.id)
    try {
      await usersService.deleteUser(userId)
    } catch (error) {
      // Already deleted elsewhere, so the list is correct either way
      if ((error as { responseStatus?: number }).responseStatus !== 404) throw error
    }
    return res.redirect('/users')
  })

  // Example of an audited route.
  router.post(
    '/perform-search',
    auditSearchRequest({ services, page: Page.SEARCH_OFFENDERS }),
    async (_req, res, _next) => {
      return res.redirect('/')
    },
  )

  return router
}
