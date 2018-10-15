const OutBancorToken = artifacts.require("OutBancorToken");

contract('OutBancorToken Test', async (accounts) => {
    it("should buy all tokens success", async () => {
        let out = await OutBancorToken.deployed()

        let tx = await out.sendTransaction({value: 10e+18, from: accounts[0]})
        console.log(tx.logs[0].args)
        let wad = tx.logs[0].args.wad
        console.log(wad)

        let res = await out.balanceOf.call(accounts[0])
        assert.equal(res.toNumber(), wad.toNumber(), 'failed')
        await out.sell(wad, {from: accounts[0]})
    })

    it("should buy all tokens success with 3 times", async () => {
        let out = await OutBancorToken.deployed()

        let tx = await out.sendTransaction({value: 3e+18, from: accounts[1]})
        console.log(tx.logs[0].args)
        let wad1 = tx.logs[0].args.wad
        console.log(wad1)

        tx = await out.sendTransaction({value: 3e+18, from: accounts[1]})
        console.log(tx.logs[0].args)
        let wad2 = tx.logs[0].args.wad
        console.log(wad2)

        tx = await out.sendTransaction({value: 4e+18, from: accounts[1]})
        console.log(tx.logs[0].args)
        let wad3 = tx.logs[0].args.wad
        console.log(wad3)

        let wad = await out.balanceOf.call(accounts[1])
        console.log(wad)
        tx = await out.sell(wad, {from: accounts[1]})
        console.log(tx.logs[0].args)
        wad = tx.logs[0].args.wad
        console.log(wad)

        let res = await out.balanceOf.call(accounts[1])
        assert.equal(res.toNumber(), 0, 'failed')
    })


    it("should buy success", async () => {
        let out = await OutBancorToken.deployed()

        let tx = await out.sendTransaction({value: 5e+18, from: accounts[2]})
        console.log(tx.logs[0].args)
        let wad = tx.logs[0].args.wad
        console.log(wad)

        let res = await out.balanceOf.call(accounts[2])
        assert.equal(res.toNumber(), wad.toNumber(), 'failed')
    })

    it("should sell success", async () => {
        let out = await OutBancorToken.deployed()

        let tx = await out.sendTransaction({value: 1e+18, from: accounts[3]})
        console.log(tx.logs[0].args)
        let wad = tx.logs[0].args.wad
        console.log(wad)

        let res = await out.balanceOf.call(accounts[3])
        assert.equal(res.toNumber(), wad.toNumber(), 'failed')

        // test sell
        tx = await out.sell(wad, {from: accounts[3]})
        console.log(tx.logs[0].args)
        wad = tx.logs[0].args.wad
        console.log(wad)
        
        res = await out.balanceOf.call(accounts[3])
        assert.equal(res.toNumber(), 0, 'failed')
    })

})