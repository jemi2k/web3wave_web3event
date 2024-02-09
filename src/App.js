import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import SeatChart from './components/SeatChart'

// ABIs
import Web3Event from './abis/Web3Event.json'

// Config
import config from './config.json'
import Footer from './components/Footer'
import Card1 from './components/Card1'
import ContactUs from './components/ContactUs'
import Card2 from './components/Card2'


function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)

  const [web3Event, setWeb3Event] = useState(null)
  const [eventts, setEventts] = useState([])
  const [eventt, setEventt] = useState({})
  const [toggle, setToggle] = useState(false)

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    const web3Event = new ethers.Contract(config[network.chainId].Web3Event.address, Web3Event, provider)
    setWeb3Event(web3Event)

    const totalEventts = await web3Event.totalEventts()
    const eventts = []

    for (var i = 1; i <= totalEventts; i++) {
      const eventt = await web3Event.getEventt(i)
      eventts.push(eventt)
    }
    
    setEventts(eventts)
    

    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <> 
    
      <header>
        <Navigation account={account} setAccount={setAccount} />
      </header>

      {eventts.map((eventt, index) => (
     <Card2 
            eventt={eventt}
            id={index + 1}
            web3Event={web3Event}
            provider={provider}
            account={account}
            toggle={toggle}
            setToggle={setToggle}
            setEventt={setEventt}
            key={index}
      />

     ))}
     <Card1 />
     


      {toggle && (
        <SeatChart
          eventt={eventt}
          
          web3Event={web3Event}
         
          provider={provider}
          setToggle={setToggle}
        />
      )}

     <ContactUs /> 
    <footer>
      <Footer />
      </footer>
    </>
  );
}

export default App;