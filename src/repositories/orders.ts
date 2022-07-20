import { ICreateOrderRequest, IOrder } from "../interface/interface"
import orders from "../models/orders"
import { ethers } from "ethers"

class OrdersRepository {
    constructor() {}

    getVolumeInfo = async (
        chain: String,
        address: String,
        date?: Date
    ) => {
        let filters
        if ( date ) {
            filters = [
                {'status': 'EXECUTED'},
                {'srcChain': chain},
                {'collectionAddr': address},
                {updatedAt: {$gte: date}}
            ]
        } else {
            filters = [
                {'status': 'EXECUTED'},
                {'srcChain': chain},
                {'collectionAddr': address},
            ]
        }
        return orders.aggregate([
            {
                $match: {
                    $and: filters
                }
            },
            { $group:
                {
                    _id: null,
                    count: { $sum: 1 },
                    volume: { $sum: "$volume" },
                }
            }]
        )
    }

    getChartInfo = async (
        chain: String,
        address: String,
        date: Date
    ) => {
        return orders.aggregate([
            {
                $match: {
                    $and: [
                        {'status': 'EXECUTED'},
                        {'srcChain': chain},
                        {'collectionAddr': address},
                        {'updatedAt': {$gte: date}}
                    ]
                }
            },
            { $group:
                {
                    _id : { day: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } } },
                    count: {$sum: 1},
                    volume: { $sum: "$volume" },
                }
            }]
        )
    }

    getOrders = async (
        filters: Array<Object>,
        sorting: any,
        from: number,
        first: number,
    ) => {
        return orders.find({ '$and': filters }).skip(from??0).limit(first??20).sort(sorting)
    }

    createOrder = async (
        data: ICreateOrderRequest
    ) => {
        const vrs = ethers.utils.splitSignature(data.signature);

        const askWithoutHash: IOrder = {
            isOrderAsk: data.isOrderAsk,
            signer: data.signer,
            collectionAddress: data.collection,
            price: data.price,
            tokenId: data.tokenId,
            chain: data.chain,
            amount: data.amount,
            strategy: data.strategy,
            currencyAddress: data.currency,
            nonce: data.nonce,
            startTime: data.startTime,
            endTime: data.endTime,
            minPercentageToAsk: data.minPercentageToAsk,
            signature: data.signature,
            params: data.params,
            status: 'VALID',
            ...vrs,
        };

        const order = new orders(askWithoutHash)
        return order.save()
    }

    getUserNonce = async (
        address: string
    ) => {
        return orders.findOne({ signer: address })
        .sort('nonce')
    }

    updateOrderStatus = async (
        _id: string,
        status: string
    ) => {
        return orders.findOneAndUpdate({_id}, {
            $set: { 'status': status, 'signature': null },
        }, {
            new: true
        })
    }
}

export default new OrdersRepository()