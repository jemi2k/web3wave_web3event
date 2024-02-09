// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Web3Event is ERC721 {
   
   address public owner;
   uint256 public totalEventts;
   uint256 public totalSupply;
   // struct, data for eventt 
   struct Eventt {         
	uint256 id; 
	string name;
	uint256 cost;
	uint256 tickets;
	uint256 maxTickets;
	string  date;
	string  time;
	string  location;

   }
   
   mapping(uint256 => Eventt) eventts;
   mapping(uint256 => mapping(address => bool)) public hasBought;
   mapping(uint256 => mapping (uint256 => address)) public seatTaken; // <-- seat assign
   mapping(uint256 => uint256[]) seatsTaken;
   
   
   modifier onlyOwner() {
	require(msg.sender == owner);
	_;
   }

   constructor(string memory _name, 
              string memory _symbol) 
    ERC721(_name, _symbol) {
		owner = msg.sender;
     }

   function list(
	string memory _name,
	uint256 _cost,
	uint256 _maxTickets,
	string memory _date,
	string memory _time,
	string memory _location
		
	) public onlyOwner {            // <-- onlyOwner -> only deployer or owner should call or create ticket event, WAGMI!
       	totalEventts++;
		eventts[totalEventts] = Eventt(
		  totalEventts, 
	     _name,
	     _cost,
	     _maxTickets,
	     _maxTickets,
	     _date,
	     _time,
	     _location
		);
		
	}

    function mint(uint256 _id, uint256 _seat) public payable {
		require(_id != 0);
		require(_id <= totalEventts); // <-- _id is not 0 or less than total total Evennts
		require(msg.value >= eventts[_id].cost); //<-- sent ETH should be equal or greater than cost

		require(seatTaken[_id][_seat] == address(0));
		require(_seat <= eventts[_id].maxTickets); // <---the seat is not taken and the seat exists

		eventts[_id].tickets -= 1;     //update ticket count
		
		seatTaken[_id][_seat] = msg.sender;  //<--- assign seat
		hasBought[_id][msg.sender] = true; // update buying status
		seatsTaken[_id].push(_seat); // <-- update seats recently taken
		totalSupply++;
		_safeMint(msg.sender, totalSupply);

	}
	
	function getEventt(uint256 _id) public view returns(Eventt memory){
		return eventts[_id];
	}

	function getSeatsTaken(uint256 _id) public view returns(uint256[] memory) {
		return seatsTaken[_id];
	}

	function withdraw() public onlyOwner {
		(bool success, ) = owner.call{value: address(this).balance}("");
		require(success);
	}

 
}
