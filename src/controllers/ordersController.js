import orders from "../models/orders.js";

/**
 * Make Order Api
 */
export const makeOrder = (req, res, next) => {
    const { isOrderAsk, signer, collection, price, tokenId, amount, strategy, currency, nonce, startTime, endTime, minPercentageToAsk, signature, srcChain, destChain } = req.body;
    
    const order = new orders({ isOrderAsk, signer, collectionAddr: collection, price, tokenId, amount, strategy, currency, nonce, startTime, endTime, minPercentageToAsk, signatureHash: signature, srcChain, destChain });

    order.save((err) => {
        if (err) { return next(err); }
        res.json({ isOrderAsk, signer, collection, price, tokenId, amount, strategy, currency, nonce, startTime, endTime, minPercentageToAsk, signature, srcChain, destChain });
    });
};

/**
 * Get Order
 */
export const getOrder = (req, res, next) => {
    orders.find({}, function(err, orders) {
        res.send(orders);
    })
}

/**
 * Get User Nonce
 */
export const getNonce = (req, res, next) => {
    const { signer } = req.body;
    const order = orders.findOne({ signer })
                        .sort('nonce')
                        .exec(function (err, member) {
                            if ( err ) {
                                return next(err);
                            }
                            res.json({"success": true, "message": null, "data": member?(member.nonce + 1):1});
                        });
}