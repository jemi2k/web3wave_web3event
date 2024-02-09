const { expect } = require("chai")
const { ethers } = require("hardhat")

const EVENTT_NAME = "Web 3 EVENTT"
const EVENTT_COST = ethers.utils.parseUnits('1', 'ether')
const EVENTT_MAX_TICKETS = 150
const EVENTT_DATE= "Feb 25"
const EVENTT_TIME = "11:23 EAT"
const EVENTT_LOCATION = "Dubai" 

const NAME = "Web3Event"
const SYMBOL = "WE"
describe("Web3Event", () => {
    
	let Web3Event
    let seller, buyer
	beforeEach(async () => {
	   	[seller, buyer] = await ethers.getSigners() // <-- accounts
		const Web3Event = await ethers.getContractFactory("Web3Event")
		web3Event = await Web3Event.deploy(NAME, SYMBOL)
        
		const transaction = await web3Event.connect(seller).list(
			EVENTT_NAME,
			EVENTT_COST,
			EVENTT_MAX_TICKETS,
			EVENTT_DATE,
			EVENTT_TIME,
			EVENTT_LOCATION
		)
		await transaction.wait()
	})


	describe("Deployment", () => {
       it("Sets the name", async () => {
	      expect(await web3Event.name()).to.equal(NAME) //<-- check name 
        })
	
       it("Sets the name", async () => {
			expect(await web3Event.symbol()).to.equal(SYMBOL) //<-- check symnol
		})

	   it("Sets the owner", async () =>{
		expect(await web3Event.owner()).to.equal(seller.address) //<-- check the owner/deployer
	   })

    })

	describe("Eventts", () => {
		it('Updates eventts count', async () => {
		const totalEventts = await web3Event.totalEventts()
		expect(totalEventts).to.be.equal(1)	
		})
		it("Returns eventts attributes", async () => {
			const eventt = await web3Event.getEventt(1)
			expect(eventt.id).to.be.equal(1)
			expect(eventt.name).to.be.equal(EVENTT_NAME)
			expect(eventt.cost).to.be.equal(EVENTT_COST)
			expect(eventt.tickets).to.be.equal(EVENTT_MAX_TICKETS)
			expect(eventt.date).to.be.equal(EVENTT_DATE)
			expect(eventt.time).to.be.equal(EVENTT_TIME)
			expect(eventt.location).to.be.equal(EVENTT_LOCATION)	
		})
	})

	describe("Minting", ()=> {
		const ID = 1
		const SEAT = 50
		const AMOUNT = ethers.utils.parseUnits('1', 'ether')

		beforeEach(async () => {
			const transaction = await web3Event.connect(buyer).mint(ID, SEAT, { value: AMOUNT })
			await transaction.wait()
		})

		it('Updates ticket amount', async () => {
			const eventt = await web3Event.getEventt(1)
			expect(eventt.tickets).to.be.equal(EVENTT_MAX_TICKETS - 1)
		})

		it('Updates buying satatus', async () => {
			const status = await web3Event.hasBought(ID, buyer.address)
			expect(status).to.be.equal(true)
		})

		it('Updates status of seat', async () => {
			const seat = await web3Event.seatTaken(ID, SEAT)
			expect(seat).to.be.equal(buyer.address)
		})

		it("Updates all seating status", async () => {
			const seats = await web3Event.getSeatsTaken(ID)
			expect(seats.length).to.be.equal(1)
			expect(seats[0]).to.be.equal(SEAT)
		})

		it('Updates the contract balance', async () => {
			const balance = await ethers.provider.getBalance(web3Event.address)
			expect(balance).to.be.equal(AMOUNT)
		})
	})

	describe("Withdrawing", () => {
		const ID = 1
		const SEAT = 50
		const AMOUNT = ethers.utils.parseUnits("1", "ether")
		let balanceBefore

		beforeEach(async () => {
			balanceBefore = await ethers.provider.getBalance(seller.address)
            let transaction = await web3Event.connect(buyer).mint(ID, SEAT, {value: AMOUNT})
			await transaction.wait()

			transaction = await web3Event.connect(seller).withdraw()
			await transaction.wait()
		})

		it('Updates the owner balance', async () => {
			const balanceAfter = await ethers.provider.getBalance(seller.address)
			expect(balanceAfter).to.be.greaterThan(balanceBefore)
		})

		it('Updates the contract balance', async () => {
			const balance = await ethers.provider.getBalance(web3Event.address)
			expect(balance).to.equal(0)
		})
	})
})