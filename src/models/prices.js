"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const pricesSchema = new Schema({
    collectionAddr: String,
    price: Number,
}, { timestamps: true });
exports.default = mongoose.model('prices', pricesSchema);
//# sourceMappingURL=prices.js.map