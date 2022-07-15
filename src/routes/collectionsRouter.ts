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

    this.router.route('/nfts').post(this.collectionsController.getNFTs)   // Get NFTs of the collection
    this.router.route('/:col_url').get(this.collectionsController.getCollectionInfo) // Get Collection Detail
    this.router.route('/:col_url').post(this.collectionsController.getCollectionOwners) // Get Collection Detail
    this.router.route('/:col_url/:token_id').get(this.collectionsController.getNFTInfo) // Get NFT Detail
  }
}
export default new CollectionsRouter().router