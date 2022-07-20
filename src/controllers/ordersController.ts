import { Request, Response, NextFunction } from 'express'
import { apiErrorHandler } from '../handlers/errorHandler'

import collections from "../repositories/collections"
import orders from "../repositories/orders"
import prices from "../repositories/prices"
import { ICreateOrderRequest, IOrder } from '../interface/interface'

export default class OrdersController {
  constructor() { }

  /**
   * Get Order Function
   * @param isOrderAsk: Specifies whether the order is ask or bid, true/false
   * @param collection: Collection contract address. Must be a valid Ethereum address.
   * @param tokenId: Id of the specific token
   * @param signer: Signer address. Must be a valid Ethereum address.
   * @param strategy: Strategy contract address.
   * @param currency: Address of the payment token.
   * @param price: Price range for offers to filter by
   * {
   *    "min": "4100",
   *    "max": "8000"
   * }
   * @param startTime: Start timestamp. This accepts the string representation of the timestamp in seconds.
   * @param endTime: End timestamp. This accepts the string representation of the timestamp in seconds.
   * @param status: Order statuses to filter by. This can be a group of multiple statuses, which will be applied OR. CANCELLED, EXECUTED, EXPIRED, VALID
   * @param pagination: Pagination filter. When specified, it will return orders starting from the order with hash of cursor, with first amount. cursor represents the order hash. Default to 20, max to 50.
   * {
   *    "first": 10,
   *    "from": 12
   * }
   * @param sort: Sort by option. EXPIRING_SOON, NEWEST, PRICE_ASC, PRICE_DESC
   * @param chain: Chain of the collection
   */

  getOrders = async (req: Request, res: Response, next: NextFunction) => {
    const { isOrderAsk, collection, tokenId, signer, strategy, currency, min, max, startTime, endTime, status, first, from, sort, chain } = req.body
    
    const filters = new Array
    if ( isOrderAsk ) {
        filters.push({isOrderAsk: isOrderAsk})
    }
    if ( collection ) {
        filters.push({collectionAddr: collection})
    }
    if ( tokenId ) {
        filters.push({tokenId: tokenId})
    }
    if ( signer ) {
        filters.push({signer: signer})
    }
    if ( strategy ) {
        filters.push({strategy: strategy})
    }
    if ( currency ) {
        filters.push({currency: currency})
    }
    if ( min > 0 ) {
        filters.push({price: {$gte:min}})
    }
    if ( max > 0 ) {
        filters.push({price: {$lte:max}})
    }
    if ( startTime > 0 ) {
        filters.push({startTime: {$lte:startTime}})
    }
    if ( endTime > 0 ) {
        filters.push({endTime: {$gte:endTime}})
    }
    if ( status?.length > 0 ) {
        filters.push({status: {$in:status}})
    }
    if ( chain ) {
        filters.push({srcChain: chain})
    }

    let sorting = new Object
    if ( sort == 'EXPIRING_SOON' )
    {
        sorting = {endTime: 1}
    }
    else if ( sort == 'NEWEST' ) {
        sorting = {startTime: 1}
    }
    else if ( sort == 'PRICE_ASC' ) {
        sorting = {price: 1}
    }
    else if ( sort == 'PRICE_DESC' ) {
        sorting = {price: -1}
    } else {
        sorting = {_id: 1}
    }

    if ( status?.length == undefined ) {
        return res.status(400).json({
            "success": false,
            "name": "Request Error",
            "message": 'Each value in status must be one of the following values: CANCELLED, EXECUTED, EXPIRED, VALID'
        })
    }

    try {
        const filteredOrders = await orders.getOrders(filters, sorting, from, first)
        return res.json({
            "success": true,
            "message": null,
            "data": filteredOrders,
        })
    } catch (error) {
        apiErrorHandler(error, req, res, 'Get Orders failed.')
    }
  }

  makeOrder = async (req: Request, res: Response, next: NextFunction) => {
    const createOrderRequest: ICreateOrderRequest = req.body;

    try {
        const order = await orders.createOrder(createOrderRequest)
        return res.json({
            "success": true,
            "message": null,
            "data": order,
        })
    } catch (error) {
        apiErrorHandler(error, req, res, 'Get Orders failed.')
    }
  }

  changeOrderStatus = async (req, res) => {
    const { hash, status } = req.body

    try {
        const updatedOrder:IOrder = await orders.updateOrderStatus(hash, status) as any

        return res.json({
            "success": true,
            "message": null,
            "data": updatedOrder
        })
    } catch (error) {
        apiErrorHandler(error, req, res, 'Get User Nonce failed.')
    }
  }
}