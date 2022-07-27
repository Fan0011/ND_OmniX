
import * as Test from "../abis/Test.json"
import * as OmniXExchange from "../abis/OmniXExchange.json"
import { ethers } from 'ethers'

export const installBSCTestEvents = () => {
    var wsProvider = new ethers.providers.WebSocketProvider(process.env.BSCTEST_RPC as string)
    let contract = new ethers.Contract(Test.bsctest, Test.abi, wsProvider)

    contract.on("updated", (from, to, value, event) => {
        console.log(from)
    })
}

export const installRopstenEvents = () => {
    var wsProvider = new ethers.providers.WebSocketProvider(process.env.ROPSTEN_RPC as string)
    let contract = new ethers.Contract(Test.ropsten, Test.abi, wsProvider)

    contract.on("updated", (from, to, value, event) => {
        console.log(from)
    })
}

export const installRinkebyEvents = () => {
    var wsProvider = new ethers.providers.WebSocketProvider(process.env.RINKEBY_RPC as string)
    let contract = new ethers.Contract("0x8405eA012aC6a3Ac998e42793e3275e011cf8E4e", OmniXExchange.abi, wsProvider)

    contract.on("CancelAllOrders", (from, to, value, event) => {
        console.log(from)
        console.log(to)
        console.log(value)
        console.log(event)
    })
}