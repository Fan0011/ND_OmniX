import collections from "../models/collections.js";
/**
 * Collections
 */

/**
 * Add Collection Function
 */
export const addCollection = (req, res, next) => {
    const {
        address,
        owner,
        name,
        description,
        symbol,
        type,
        websiteLink,
        facebookLink,
        twitterLink,
        instagramLink,
        telegramLink,
        mediumLink,
        discordLink,
        isVerified,
        isExplicit
    } = req.body;
    
    const collection = new collections({
        address,
        owner,
        name,
        description,
        symbol,
        type,
        websiteLink,
        facebookLink,
        twitterLink,
        instagramLink,
        telegramLink,
        mediumLink,
        discordLink,
        isVerified,
        isExplicit
    });

    collection.save((err) => {
        if (err) { return next(err); }
        res.json({
            address,
            owner,
            name,
            description,
            symbol,
            type,
            websiteLink,
            facebookLink,
            twitterLink,
            instagramLink,
            telegramLink,
            mediumLink,
            discordLink,
            isVerified,
            isExplicit
        });
    });
}

/**
 * Get Collection Function
 */
export const getCollection = (req, res, next) => {
    const { address } = req.body;
    collections.findOne({ address })
    .sort('nonce')
    .exec(function (err, collection) {
        if ( err ) {
            return next(err);
        }
        res.json({"success": true, "message": null, "data": collection});
    });
}

/**
 * Get Collections Stats Function
 */
export const getCollectionStat = (req, res, next) => {
    const { address } = req.body;
}