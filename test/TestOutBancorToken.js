const OutBancorToken = artifacts.require("OutBancorToken");

contract('MarketMakerProxy Test', async (accounts) => {
    it("should had 9.900906e+24 ob", async () => {
        let out = await OutBancorToken.deployed()

        let res = await out.balanceOf.call('0xE6A055BE46236019204aa432c9989830a8ccA72A')
        assert.equal(res.toNumber(), 9.900906e+24, 'wrong number')
    })

    it("should buy success", async () => {
        let out = await OutBancorToken.deployed()

        let tx = await out.sendTransaction({value: 1e+18, from: accounts[0]})
        console.log(tx.logs[0].args)

        let res = await out.balanceOf.call(accounts[0])
        console.log(res)
        assert.equal(res.toNumber() > 0, true, 'failed')
        assert.equal(res.toNumber(), tx.logs[0].args.wad.toNumber(), 'failed')
    })

    it("should sell success", async () => {
        let out = await OutBancorToken.deployed()

        let tx = await out.sendTransaction({value: 1e+18, from: accounts[1]})
        console.log(tx.logs[0].args)
        let wad = tx.logs[0].args.wad

        tx = await out.sell(wad, {from: accounts[1]})
        console.log(tx.logs[0].args)

        let res = await out.balanceOf.call(accounts[1])
        assert.equal(res.toNumber(), 0, 'failed')
    })
})