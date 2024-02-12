import { useEffect, useState } from 'react'
import logo from '../assets/logo.png';
import Seat from './Seat'

import close from '../assets/close.svg'

const SeatChart = ({ eventt, web3Event, provider, setToggle }) => {
  const [seatsTaken, setSeatsTaken] = useState(false)
  const [hasSold, setHasSold] = useState(false)

  const getSeatsTaken = async () => {
    const seatsTaken = await web3Event.getSeatsTaken(eventt.id)
    setSeatsTaken(seatsTaken)
  }

  const buyHandler = async (_seat) => {
    setHasSold(false)

    const signer = await provider.getSigner()
    const transaction = await web3Event.connect(signer).mint(eventt.id, _seat, { value: eventt.cost })
    await transaction.wait()

    setHasSold(true)
  }

  useEffect(() => {
    getSeatsTaken()
  }, [hasSold])

  return (
    <div className="occasion">
      <div className="occasion__seating">
        <h1>{eventt.name} Seating Map</h1>

        <button onClick={() => setToggle(false)} className="occasion__close">
          <img src={close} alt="Close" />
        </button>

        <div className="occasion__stage">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
      <img src={logo} className="h-8" alt="Logo"/>
      <span className="self-center text-2xl font-semibold 
      whitespace-nowrap dark:text-white">Web3Wave NFT Tickets</span>
      <span className="text-bottom text-1xl  
      whitespace-nowrap dark:text-white">If it's a 🔵 circle, it's purchased.</span>
  </a>
          
          </div>

        {seatsTaken && Array(25).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={1}
            columnStart={0}
            maxColumns={5}
            rowStart={2}
            maxRows={5}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}

        <div className="occasion__spacer--1 ">
          <strong>VIP 1</strong>
        </div>

        {seatsTaken && Array(Number(eventt.maxTickets) - 50).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={26}
            columnStart={6}
            maxColumns={15}
            rowStart={2}
            maxRows={15}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}

        <div className="occasion__spacer--2">
          <strong>VIP 2</strong>
        </div>

        {seatsTaken && Array(25).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={(Number(eventt.maxTickets) - 24)}
            columnStart={22}
            maxColumns={5}
            rowStart={2}
            maxRows={5}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}
      </div>
    </div >
  );
}

export default SeatChart;