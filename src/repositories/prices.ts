import prices from "../models/prices";

class PricesRepository {
    constructor() {}

    getFloorPrices = async (
        address: string
    ) => {
        const currentDate = new Date().getTime();
        const dateBefore24h = new Date(currentDate - 24 * 60 * 60 * 1000);
        const dateBefore7d = new Date(currentDate - 7 * 24 * 60 * 60 * 1000);
        const dateBefore30d = new Date(currentDate - 30 * 24 * 60 * 60 * 1000);

        return prices.aggregate([{
            $addFields: {
                floor24h: {
                    $cond: [ { $lt: ['$updatedAt', dateBefore24h] }, '$price', 0 ]
                },
                floor7d: {
                    $cond: [ { $lt: ['$updatedAt', dateBefore7d] }, '$price', 0 ]
                },
                floor30d: {
                    $cond: [ { $lt: ['$updatedAt', dateBefore30d] }, '$price', 0 ]
                }
            }
        },
        {
            $match: {
                collectionAddr: address,
            }
        },
        { $group:
            {
                _id: null,
                floor : { $min: "$price" },
                floor24h: { $min: "$floor24h" },
                floor7d: { $min: "$floor7d" },
                floor30d: { $min: "$floor30d" }
            }
        }]);
    }

    updatePrice = async (
        collectionAddr: string,
        price: number
    ) => {
        let filters = [
            {collectionAddr: collectionAddr},
            {price: {$lte: price}}
        ];

        prices.find({ $and: filters }).exec((err, order) => {
            if ( order.length == 0 ) {
                const newPrice = new prices({ 
                    collectionAddr: collectionAddr,
                    price: price
                });

               return newPrice.save();
            }
        })
    }
}

export default new PricesRepository();