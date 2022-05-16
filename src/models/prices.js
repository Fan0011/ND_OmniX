import mongoose from "mongoose";
const Schema = mongoose.Schema;

const pricesSchema = new Schema({
    collectionAddr: String,
    price: Number,
    updated: Number,
});

export default mongoose.model('prices', pricesSchema);