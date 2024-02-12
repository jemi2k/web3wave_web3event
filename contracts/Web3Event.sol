// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Web3Event is ERC721 {
    address public owner;
    uint256 public totalEventts; // Total number of events
    uint256 public totalSupply; // Total number of tickets minted

    struct Eventt {
        uint256 id;
        string name;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }

    mapping(uint256 => Eventt) public eventts; // Mapping of event ID to Eventt struct
    mapping(uint256 => mapping(address => bool)) public hasBought; // Mapping of event ID to buyer address to purchase status
    mapping(uint256 => mapping(uint256 => address)) public seatTaken; // Mapping of event ID to seat number to buyer address
    mapping(uint256 => uint256[]) public seatsTaken; // Mapping of event ID to array of taken seats

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    // List a new event
    function list(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) public onlyOwner {
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

    // Mint a ticket for the specified event ID and seat number
    function mint(uint256 _id, uint256 _seat) public payable {
        require(_id != 0 && _id <= totalEventts, "Invalid event ID");
        require(msg.value >= eventts[_id].cost, "Insufficient payment");
        require(_seat <= eventts[_id].maxTickets, "Invalid seat");
        require(seatTaken[_id][_seat] == address(0), "Seat already taken");

        eventts[_id].tickets--;
        seatTaken[_id][_seat] = msg.sender;
        hasBought[_id][msg.sender] = true;
        seatsTaken[_id].push(_seat);
        totalSupply++;
        _safeMint(msg.sender, totalSupply);
    }

    // Get details of the event with the specified ID
    function getEventt(uint256 _id) public view returns (Eventt memory) {
        return eventts[_id];
    }

    // Get array of taken seats for the event with the specified ID
    function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
        return seatsTaken[_id];
    }

    // Withdraw contract balance to owner
    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}
