import { Router } from 'express'
import UsersController from '../controllers/usersController'

class CollectionsRouter {
  router = Router()
  usersController = new UsersController()

  constructor() {
    this.intializeRoutes()
  }
  intializeRoutes() {
    this.router.route('/nfts').get(this.usersController.getNFTs)
  }
}
export default new CollectionsRouter().router