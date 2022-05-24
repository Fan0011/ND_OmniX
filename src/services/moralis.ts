/* import moralis */
const Moralis = require("moralis/node");
const serverUrl = "https://q82gmnpbr7jl.usemoralis.com:2053/server";
const appId = "6EdD0K6wPPjJ7ddczXzCeq50W8d0H9UXoyyr7Vz1";
const moralisSecret = "XRTTaUgsal62lyMkSCJ2RigReAMzrajnC5X97U81VfN3nWNYrWDmvHsf2KOBQ7XA";

export const hasUserNFT = async (chain: string, signer: string, collection: string, tokenId) => {
    await Moralis.start({ serverUrl, appId, moralisSecret });

    if ( tokenId == null ) {
        const options = { address: collection, chain };
        const nftOwners = await Moralis.Web3API.token.getNFTOwners(options);
        for ( let nftOwner of nftOwners.result ) {
            if ( nftOwner.owner_of == signer ) {
                return true;
            }
        }
    } else if ( tokenId >= 0 ) {
        const options = { address: collection, token_id: tokenId, chain };
        const nftOwners = await Moralis.Web3API.token.getTokenIdOwners(options);
        for ( let nftOwner of nftOwners.result ) {
            if ( nftOwner.owner_of == signer ) {
                return true;
            }
        }
    }
    return false;
}