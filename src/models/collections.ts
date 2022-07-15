import * as mongoose from "mongoose"

const Schema = mongoose.Schema

const collectionsSchema = new Schema({
    owner: String,
    symbol: String,
    type: String,
    websiteLink: String,
    facebookLink: String,
    twitterLink: String,
    instagramLink: String,
    telegramLink: String,
    mediumLink: String,
    discordLink: String,
    isVerified: Boolean,
    isExplicit: Boolean,
    standard: {
        type: String,
        default: 'erc'
    },

    name: String,
    network: String,
    discord: String,
    website: String,
    twitter: String,
    medium: String,
    instagram: String,
    telegram: String,
    banner_image: String,
    profile_image: String,
    description: String,
    col_url: String,
    col_name: String,
    count: Number,
    by_name: Boolean,
    address: String,
    artblocks: Boolean,
    attrs: {type: Map},
    chain: String,
})

export default mongoose.model('collections', collectionsSchema)