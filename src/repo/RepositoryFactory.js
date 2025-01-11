import StatRepository from './StatRepository'
import UserRepository from './UserRepository'

const repositories = {
  user: UserRepository,
  posts: StatRepository
}

export const RepositoryFactory = {
  get: name => repositories[name]
}
