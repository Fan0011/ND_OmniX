import { Router } from 'express'
import CollectionsController from '../controllers/collectionsController'

class CollectionsRouter {
  router = Router()
  collectionsController = new CollectionsController()

  constructor() {
    this.intializeRoutes()
  }
  intializeRoutes() {
    this.router.route('/').get(this.collectionsController.getCollection)
    this.router.route('/').post(this.collectionsController.addCollection)
    this.router.route('/stats').get(this.collectionsController.getCollectionStat)
    this.router.route('/chart').get(this.collectionsController.getCollectionChart)
    this.router.route('/nfts').post(this.collectionsController.getNFTs)
    this.router.route('/:chain/:address').get(this.collectionsController.getCollectionInfo)
    this.router.route('/:chain/:address/:tokenId').get(this.collectionsController.getNFTInfo)
  }
}
export default new CollectionsRouter().router