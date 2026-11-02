import { AuditServiceFactory } from '@ministryofjustice/hmpps-audit-client'
import { dataAccess } from '../data'
import ExampleService from './exampleService'
import UsersService from './usersService'
import logger from '../../logger'
import config from '../config'

export const services = () => {
  const { applicationInfo, exampleApiClient, usersApiClient } = dataAccess()

  const auditService = AuditServiceFactory.createInstance(config.sqs.audit, logger)

  return {
    applicationInfo,
    auditService,
    exampleService: new ExampleService(exampleApiClient),
    usersService: new UsersService(usersApiClient),
  }
}

export type Services = ReturnType<typeof services>
