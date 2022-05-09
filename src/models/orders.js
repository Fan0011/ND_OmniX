import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ordersSchema = new Schema({
    isOrderAsk: Boolean,
    signer: String,
    collectionAddr: String,
    price: Number,
    tokenId: Number,
    amount: Number,
    strategy: String,
    currency: String,
    nonce: Number,
    startTime: Number,
    endTime: Number,
    minPercentageToAsk: Number,
    signatureHash: String,
    srcChain: String,
    destChain: String,
});

export default mongoose.model('orders', ordersSchema);