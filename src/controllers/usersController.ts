import { Request, Response, NextFunction } from 'express'
import { apiErrorHandler } from '../handlers/errorHandler'
import { getUserNFTs } from '../services/moralis'

export default class UsersController {
  constructor() { }

  /**
   * Get NFTs Function
   * @param req 
   * @param res 
   * @param next 
   */
  getNFTs = async (req: Request, res: Response, next: NextFunction) => {
    const { chain, address } = req.body

    try {
        const nfts = await getUserNFTs(chain, address)

        res.json({"success": true, "message": null, "data": nfts})
    } catch (error) {
        apiErrorHandler(error, req, res, 'Get NFTs failed.')
    }
  }
}