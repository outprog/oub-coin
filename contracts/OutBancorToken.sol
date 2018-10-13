pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract OutBancorToken is
    StandardToken
    {
    using SafeMath for uint256;

    string public name = "Outprog Token With Bancor";
    string public symbol = "OUB";
    string public unit = "ob";
    uint public decimals = 18;

    uint256 public supplyLimit = 19900906 * (10 ** decimals);
    uint256 public etherLimit = 100 ether;

    address public initHolder = 0xE6A055BE46236019204aa432c9989830a8ccA72A;
    address public blackHole = 0x0000000000000000000000000000000000000000;

    event Buy(address indexed user, uint eth, uint wad);
    event Sell(address indexed user, uint eth, uint wad);

    constructor () public {
        uint initAmount = 9900906 * (10 ** decimals);
        balances[initHolder] = initAmount;
        totalSupply_ = totalSupply_.add(initAmount);
        emit Transfer(blackHole, initHolder, initAmount);
    }

    function () public payable {
        buy();
    }

    function buy() public payable {
        require(address(this).balance < etherLimit, "SUPPLY_LIMIT");

        uint256 bal = supplyLimit.sub(totalSupply_);
        uint256 ethBal = etherLimit.sub(msg.value);
        uint256 wad = bal.mul(msg.value).div(ethBal);

        balances[msg.sender] = balances[msg.sender].add(wad);
        totalSupply_ = totalSupply_.add(wad);

        emit Buy(msg.sender, msg.value, wad);
    }

    function sell(uint wad) public {
        require(balances[msg.sender] >= wad, "BALANCE_ERROR");

        uint256 val = address(this).balance.mul(wad).div(totalSupply_);

        balances[msg.sender] = balances[msg.sender].sub(wad);
        totalSupply_ = totalSupply_.sub(wad);
        
        msg.sender.transfer(val);
        
        emit Sell(msg.sender, val, wad);
    }
}
