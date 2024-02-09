const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // <-- Setup accounts & variables, seller = deployer -->
  const [seller] = await ethers.getSigners()
  const NAME = "Web3Event"
  const SYMBOL = "WE"

  // <-- deploy contract --> 
  const Web3Event = await ethers.getContractFactory("Web3Event")
  const web3Event = await Web3Event.deploy(NAME, SYMBOL)
  await web3Event.deployed()

  console.log(`Deployed Web3Event Contract at: ${web3Event.address}\n`)

  // List 6 events
  const eventts = [
    {
      name: "Crypto Mafia",
      cost: tokens(3),
      tickets: 0,
      date: "May 31",
      time: "6:00PM EST",
      location: "London, UK"
    },
    {
      name: "Web3 Wave Event",
      cost: tokens(1),
      tickets: 125,
      date: "Jun 2",
      time: "1:00PM JST",
      location: "Dubai, UAE"
    },
    {
      name: "Metaschool R2W3 Event",
      cost: tokens(0.25),
      tickets: 200,
      date: "Jun 9",
      time: "10:00AM TRT",
      location: "Singapore"
    },
    {
      name: "Bitcoin the Future",
      cost: tokens(5),
      tickets: 0,
      date: "Jun 11",
      time: "2:30PM CST",
      location: "American Airlines Center - Dallas, TX"
    },
    {
      name: "Crypto in Toronto",
      cost: tokens(1.5),
      tickets: 125,
      date: "Jun 23",
      time: "11:00AM EST",
      location: "Toronto, Canada"
    }
  ]

  for (var i = 0; i < 5; i++) {
    const transaction = await web3Event.connect(seller).list(
      eventts[i].name,
      eventts[i].cost,
      eventts[i].tickets,
      eventts[i].date,
      eventts[i].time,
      eventts[i].location,
    )

    await transaction.wait()

    console.log(`Listed Event ${i + 1}: ${eventts[i].name}`)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});