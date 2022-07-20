import * as mongoose from "mongoose"
const Schema = mongoose.Schema

const ordersSchema = new Schema({
    isOrderAsk: Boolean,
    signer: String,
    collectionAddress: String,
    price: String,
    tokenId: String,
    chain: String,
    amount: Number,
    strategy: String,
    currencyAddress: String,
    nonce: String,
    startTime: Number,
    endTime: Number,
    minPercentageToAsk: Number,
    signature: String,
    params: [String],
    status: {
        type: String,
        enum: ['CANCELLED', 'EXECUTED', 'EXPIRED', 'VALID'],
        default: 'VALID'
    },
    v: Number,
    r: String,
    s: String,
},
{ timestamps: true })

export default mongoose.model('orders', ordersSchema)