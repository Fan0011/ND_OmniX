import collections from "../models/collections.js";
import orders from "../models/orders.js";
import prices from "../models/prices.js";

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
    const currentDate = new Date();
    const dateBefore24h = new Date(currentDate - 24 * 60 * 60 * 1000);
    const dateBefore7d = new Date(currentDate - 7 * 24 * 60 * 60 * 1000);
    const dateBefore30d = new Date(currentDate - 30 * 24 * 60 * 60 * 1000);
    const dateBefore3m = new Date(currentDate - 90 * 24 * 60 * 60 * 1000);
    const dateBefore6m = new Date(currentDate - 180 * 24 * 60 * 60 * 1000);
    const dateBefore1y = new Date(currentDate - 365 * 24 * 60 * 60 * 1000);

    let result = {
        'address': address,
        'floorPrice': 0,
        'floorChange24h': 0,
        'floorChange7d': 0,
        'floorChange30d': 0,
        'volume7d': 0,
        'average7d': 0,
        'count7d': 0,
        'volume1m': 0,
        'average1m': 0,
        'count1m': 0,
        'volume3m': 0,
        'average3m': 0,
        'count3m': 0,
        'volume6m': 0,
        'average6m': 0,
        'count6m': 0,
        'volume1y': 0,
        'average1y': 0,
        'count1y': 0,
        'volumeAll': 0,
        'averageAll': 0,
        'countAll': 0
    };

    prices.aggregate([{
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
    }])
    .exec(function (err, floor) {
        if ( err ) return next(err);

        if ( floor[0] ) {
            floor = floor[0];
            result['floorPrice'] = floor.floor;
            if ( floor.floor24h > 0 ) {
                result['floorChange24h'] = floor.floor24h - floor.floor;
            } else {
                result['floorChange24h'] = floor.floor;
            }
            if ( floor.floor7d > 0 ) {
                result['floorChange7d'] = floor.floor7d - floor.floor;
            } else {
                result['floorChange7d'] = floor.floor;
            }
            if ( floor.floor30d > 0 ) {
                result['floorChange30d'] = floor.floor30d - floor.floor;
            } else {
                result['floorChange30d'] = floor.floor;
            }
        }
    
        orders.aggregate([
        {
            $match: {
                $and: [
                    {'status': 'EXECUTED'},
                    {'collectionAddr': address},
                    {updatedAt: {$gte: dateBefore24h}}
                ]
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
        .exec(function (err, order) {
            if ( err ) return next(err);
            if ( order[0] ) {
                order = order[0];
                result['volume24h'] = order.volume;
                result['count24h'] = order.count;
                if ( order.count > 0 ) {
                    result['average24h'] = Math.floor(order.volume / order.count);
                }
            }
            
            orders.aggregate([
            {
                $match: {
                    $and: [
                        {'status': 'EXECUTED'},
                        {'collectionAddr': address},
                        {updatedAt: {$gte: dateBefore7d}}
                    ]
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
            .exec(function (err, order) {
                if ( err ) return next(err);
                if ( order[0] ) {
                    order = order[0];
                    result['volume7d'] = order.volume;
                    result['count7d'] = order.count;
                    if ( order.count > 0 ) {
                        result['average7d'] = Math.floor(order.volume / order.count);
                    }
                }
    
                orders.aggregate([
                {
                    $match: {
                        $and: [
                            {'status': 'EXECUTED'},
                            {'collectionAddr': address},
                            {updatedAt: {$gte: dateBefore30d}}
                        ]
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
                .exec(function (err, order) {
                    if ( err ) return next(err);
                    if ( order[0] ) {
                        order = order[0];
                        result['volume1m'] = order.volume;
                        result['count1m'] = order.count;
                        if ( order.count > 0 ) {
                            result['average1m'] = Math.floor(order.volume / order.count);
                        }
                    }
    
                    orders.aggregate([
                    {
                        $match: {
                            $and: [
                                {'status': 'EXECUTED'},
                                {'collectionAddr': address},
                                {updatedAt: {$gte: dateBefore3m}}
                            ]
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
                    .exec(function (err, order) {
                        if ( err ) return next(err);
                        if ( order[0] ) {
                            order = order[0];
                            result['volume3m'] = order.volume;
                            result['count3m'] = order.count;
                            if ( order.count > 0 ) {
                                result['average3m'] = Math.floor(order.volume / order.count);
                            }
                        }
    
                        orders.aggregate([
                        {
                            $match: {
                                $and: [
                                    {'status': 'EXECUTED'},
                                    {'collectionAddr': address},
                                    {updatedAt: {$gte: dateBefore6m}}
                                ]
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
                        .exec(function (err, order) {
                            if ( err ) return next(err);
                            if ( order[0] ) {
                                order = order[0];
                                result['volume6m'] = order.volume;
                                result['count6m'] = order.count;
                                if ( order.count > 0 ) {
                                    result['average6m'] = Math.floor(order.volume / order.count);
                                }
                            }
    
                            orders.aggregate([
                            {
                                $match: {
                                    $and: [
                                        {'status': 'EXECUTED'},
                                        {'collectionAddr': address},
                                        {updatedAt: {$gte: dateBefore1y}}
                                    ]
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
                            .exec(function (err, order) {
                                if ( err ) return next(err);
                                if ( order[0] ) {
                                    order = order[0];
                                    result['volume1y'] = order.volume;
                                    result['count1y'] = order.count;
                                    if ( order.count > 0 ) {
                                        result['average1y'] = Math.floor(order.volume / order.count);
                                    }
                                }
    
                                orders.aggregate([
                                {
                                    $match: {
                                        $and: [
                                            {'status': 'EXECUTED'},
                                            {'collectionAddr': address},
                                        ]
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
                                .exec(function (err, order) {
                                    if ( err ) return next(err);
                                    if ( order[0] ) {
                                        order = order[0];
                                        result['volumeAll'] = order.volume;
                                        result['countAll'] = order.count;
                                        if ( order.count > 0 ) {
                                            result['averageAll'] = Math.floor(order.volume / order.count);
                                        }
                                    }
                                    
                                    res.json({"success": true, "message": null, "data": result});
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}

/**
 * Get Chart Data Function
 */

export const getCollectionChart = (req, res, next) => {
    const { address, days } = req.body;
    const currentDate = new Date();
    const timesPerDay = 24 * 60 * 60 * 1000;
    const dateBefore = new Date(currentDate - days * timesPerDay);

    orders.aggregate([
    {
        $match: {
            $and: [
                {'status': 'EXECUTED'},
                {'collectionAddr': address},
                {'updatedAt': {$gte: dateBefore}}
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
    .exec(function (err, orders) {
        if ( err ) return next(err);
        
        let result = {};
        for ( var i = dateBefore.getTime(); i <= currentDate.getTime(); i = i + timesPerDay ) {
            result[new Date(i).toISOString().slice(0, 10)] = {
                count: 0,
                volume: 0,
                average: 0
            };
        }
        
        for( let order of orders ) {
            console.log(order["_id"]["day"]);
            result[order["_id"]["day"]].volume = order["volume"];
            result[order["_id"]["day"]].count = order["count"];
            if ( order["count"] > 0 ) {
                result[order["_id"]["day"]].average = order["volume"] / order["count"];
            }
        }
        
        res.json({"success": true, "message": null, "data": result});
    })
}