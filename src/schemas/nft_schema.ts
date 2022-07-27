import * as mongoose from "mongoose"

const Schema = mongoose.Schema

const nftSchema = new Schema({
    name: String,
    attributes: { type: Map },
    image: String,
    custom_id: Number,
    token: String,
    score: Number,
    rank: Number,
    token_id: Number,
    name1: String,
    price: String,
})

export default nftSchema;