const {expect} = require('chai');
describe("NFTMarket", async function () {
     /* deploy the marketplace */
     
    it("should be able to deploy the marketplace smart contract", async function () {
        const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace")
        const nftMarketplace = await NFTMarketplace.deploy()
        await nftMarketplace.deployed()
        let listingPrice = await nftMarketplace.getListingPrice()
        const name = await nftMarketplace.name()
        const symbol= await nftMarketplace.symbol()
        listingPrice = listingPrice.toString()
        expect(nftMarketplace).to.be.an('object');
        expect(name).to.equal("Metaverse Tokens");
        expect(symbol).to.equal("METT");
        expect(listingPrice).to.equal("25000000000000000")
    })
    it("should update the listing price correctly if the initial price is updated", async() => {
        const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace")
        const nftMarketplace = await NFTMarketplace.deploy()
        await nftMarketplace.deployed()

        await nftMarketplace.updateListingPrice(3000000000000000)
        let listingPrice = await nftMarketplace.getListingPrice()
        expect(listingPrice).to.equal(3000000000000000)

        await nftMarketplace.updateListingPrice(100000000000000)
        listingPrice = await nftMarketplace.getListingPrice()
        expect(listingPrice).to.equal(100000000000000)
    })
    it("Should have the correct number of items listed", async function () {
        const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace")
        const nftMarketplace = await NFTMarketplace.deploy()
        await nftMarketplace.deployed()
        let listingPrice = await nftMarketplace.getListingPrice()
        listingPrice = listingPrice.toString()
        const auctionPrice = ethers.utils.parseUnits('1', 'ether')
        /* create two tokens */
        await nftMarketplace.createToken("https://www.mytokenlocation.com", auctionPrice, { value: listingPrice })
        await nftMarketplace.createToken("https://www.mytokenlocation2.com", auctionPrice, { value: listingPrice })
      
        const [_, buyerAddress] = await ethers.getSigners()
    
        /* execute sale of token to another user */
        await nftMarketplace.connect(buyerAddress).createMarketSale(1, { value: auctionPrice })
        /* resell a token */
        await nftMarketplace.connect(buyerAddress).resellToken(1, auctionPrice, { value: listingPrice })

        /* query for and return the unsold items */
        items = await nftMarketplace.fetchMarketItems()
        /* Test for length of items */
        expect(items.length).to.equal(2)
    });
})