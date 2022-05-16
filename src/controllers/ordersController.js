import messages from "../constants/message.js";
import orders from "../models/orders.js";
import prices from "../models/prices.js";
import { getCurrentDate } from "../utils/date.js";

/**
 * Make Order Api
 */
export const makeOrder = (req, res, next) => {
    const { 
        isOrderAsk, 
        signer, 
        collection, 
        price, 
        tokenId, 
        amount, 
        strategy, 
        currency, 
        nonce, 
        startTime, 
        endTime, 
        minPercentageToAsk, 
        signature, 
        srcChain, 
        destChain 
    } = req.body;
    
    try {
        const order = new orders({ 
            isOrderAsk, 
            signer, 
            collectionAddr: collection, 
            price, 
            tokenId, 
            amount, 
            strategy, 
            currency, 
            nonce, 
            startTime, 
            endTime, 
            minPercentageToAsk, 
            signatureHash: signature, 
            srcChain, 
            destChain,
            volume: price * amount,
            updated: getCurrentDate() 
        });

        order.save((err) => {
            if (err) { return next(err); }
            res.json({
                "success": true,
                "message": null,
                "data": order
            });
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "name": BAD_REQUEST_ERROR,
            "message": messages.SOMETHING_WENT_WRONG
        })
    }
};

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
 */
export const getOrder = (req, res, next) => {
    const { isOrderAsk, collection, tokenId, signer, strategy, currency, min, max, startTime, endTime, status, first, from, sort } = req.query;
    let filters = [];
    if ( isOrderAsk ) {
        filters.push({isOrderAsk: isOrderAsk});
    }
    if ( collection ) {
        filters.push({collectionAddr: collection});
    }
    if ( tokenId ) {
        filters.push({tokenId: tokenId});
    }
    if ( signer ) {
        filters.push({signer: signer});
    }
    if ( strategy ) {
        filters.push({strategy: strategy});
    }
    if ( currency ) {
        filters.push({currency: currency});
    }
    if ( min > 0 ) {
        filters.push({price: {$gte:min}});
    }
    if ( max > 0 ) {
        filters.push({price: {$lte:max}});
    }
    if ( startTime > 0 ) {
        filters.push({startTime: {$lte:startTime}});
    }
    if ( endTime > 0 ) {
        filters.push({endTime: {$gte:endTime}});
    }
    if ( status?.length > 0 ) {
        filters.push({status: {$in:status}});
    }

    let sorting = {_id: 1};
    if ( sort == 'EXPIRING_SOON' )
    {
        sorting = {endTime: 1};
    }
    else if ( sort == 'NEWEST' ) {
        sorting = {startTime: 1};
    }
    else if ( sort == 'PRICE_ASC' ) {
        sorting = {price: 1};
    }
    else if ( sort == 'PRICE_DESC' ) {
        sorting = {price: -1};
    }

    if ( status?.length == 0 ) {
        return res.status(400).json({
            "success": false,
            "name": BAD_REQUEST_ERROR,
            "message": 'Each value in status must be one of the following values: CANCELLED, EXECUTED, EXPIRED, VALID'
        });
    }
    
    try {
        orders.find({ $and: filters }).skip(from??0).limit(first??20).sort(sorting).exec((err, orders) => {
            return res.json({
                "success": true,
                "message": null,
                "data": orders,
            });
        })
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "name": BAD_REQUEST_ERROR,
            "message": messages.SOMETHING_WENT_WRONG
        })
    }
}

/**
 * Get User Nonce
 */
export const getNonce = (req, res, next) => {
    const { signer } = req.body;

    try {
        orders.findOne({ signer })
        .sort('nonce')
        .exec(function (err, member) {
            if ( err ) {
                return next(err);
            }
            return res.json({
                "success": true, 
                "message": null, 
                "data": member?(member.nonce + 1):1
            });
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "name": BAD_REQUEST_ERROR,
            "message": messages.SOMETHING_WENT_WRONG
        })
    }
}

/**
 * Change Order Status
 */
export const changeOrderStatus = (req, res, next) => {
    const { hash, status } = req.body;

    try {
        orders.findOneAndUpdate({ _id: hash }, {
            $set: { 'status': status, 'signatureHash': null, 'updated': getCurrentDate() },
        }, {
            new: true
        }, function(err, updated_item) {
            if ( err ) return res.send(400, {error: err});
            
            if ( status == 'EXECUTED' ) {
                let filters = [];
                filters.push({collectionAddr: updated_item.collectionAddr});
                filters.push({price: {$lte:updated_item.price}});

                prices.find({ $and: filters }).exec((err, order) => {
                    if ( order.length == 0 ) {
                        const price = new prices({ 
                            collectionAddr: updated_item.collectionAddr,
                            price: updated_item.price,
                            updated: getCurrentDate()
                        });

                        price.save((err) => {
                            if (err) { return next(err); }
                        });
                    }
                })
            }
            return res.json({
                "success": true,
                "message": null,
                "data": updated_item
            });
        })
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "name": BAD_REQUEST_ERROR,
            "message": messages.SOMETHING_WENT_WRONG
        })
    }
}