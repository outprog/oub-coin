const OutBancorToken = artifacts.require("OutBancorToken");

contract('OutBancorToken Test', async (accounts) => {
    it("should buy success", async () => {
        let out = await OutBancorToken.deployed()

        let tx = await out.sendTransaction({value: 5e+18, from: accounts[0]})
        console.log(tx.logs[0].args)
        let wad = tx.logs[0].args.wad
        console.log(wad)

        let res = await out.balanceOf.call(accounts[0])
        assert.equal(res.toNumber(), wad.toNumber(), 'failed')
    })

    it("should sell success", async () => {
        let out = await OutBancorToken.deployed()

        let tx = await out.sendTransaction({value: 1e+18, from: accounts[1]})
        console.log(tx.logs[0].args)
        let wad = tx.logs[0].args.wad
        console.log(wad)

        let res = await out.balanceOf.call(accounts[1])
        assert.equal(res.toNumber(), wad.toNumber(), 'failed')

        // test sell
        tx = await out.sell(wad, {from: accounts[1]})
        console.log(tx.logs[0].args)
        wad = tx.logs[0].args.wad
        console.log(wad)
        
        res = await out.balanceOf.call(accounts[1])
        assert.equal(res.toNumber(), 0, 'failed')
    })
})