import orders from "../models/orders";

class OrdersRepository {
    constructor() {}

    getVolumeInfo = async (
        address: string,
        date?: Date
    ) => {
        let filters;
        if ( date ) {
            filters = [
                {'status': 'EXECUTED'},
                {'collectionAddr': address},
                {updatedAt: {$gte: date}}
            ];
        } else {
            filters = [
                {'status': 'EXECUTED'},
                {'collectionAddr': address},
            ];
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
        );
    }

    getChartInfo = async (
        address: string,
        date: Date
    ) => {
        return orders.aggregate([
            {
                $match: {
                    $and: [
                        {'status': 'EXECUTED'},
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
        );
    }

    getOrders = async (
        filters: Array<Object>,
        sorting: Object,
        from: number,
        first: number,
    ) => {
        return orders.find({ '$and': filters }).skip(from??0).limit(first??20).sort(sorting);
    }

    createOrder = async (
        data: Object
    ) => {
        const order = new orders(data);
        return order.save();
    }

    getUserNonce = async (
        signer: string
    ) => {
        return orders.findOne({ signer })
        .sort('nonce');
    }

    updateOrderStatus = async (
        _id: string,
        status: string
    ) => {
        return orders.findOneAndUpdate({_id}, {
            $set: { 'status': status, 'signatureHash': null },
        }, {
            new: true
        });
    }
}

export default new OrdersRepository();