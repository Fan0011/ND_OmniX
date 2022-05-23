/* import moralis */
const Moralis = require("moralis/node");
const serverUrl = "https://q82gmnpbr7jl.usemoralis.com:2053/server";
const appId = "6EdD0K6wPPjJ7ddczXzCeq50W8d0H9UXoyyr7Vz1";
const moralisSecret = "XRTTaUgsal62lyMkSCJ2RigReAMzrajnC5X97U81VfN3nWNYrWDmvHsf2KOBQ7XA";

export const hasUserNFT = async (signer: string, collection: string, tokenId: number) => {
    await Moralis.start({ serverUrl, appId, moralisSecret });

    const options = { address: "0x4E1f41613c9084FdB9E34E11fAE9412427480e56", chain: "eth" };
    const nftOwners = await Moralis.Web3API.token.getNFTOwners(options);
    console.log(nftOwners);
}