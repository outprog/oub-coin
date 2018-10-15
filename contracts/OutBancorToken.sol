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

    // uint256 public supplyLimit = 19900906 * (10 ** decimals);
    uint256 public supplyLimit = 1000 * (10 ** decimals);
    uint256 public etherMax = 10 ether;
    // uint256 public supplyLimit = 1000;
    // uint256 public etherMax = 10;
    uint256 public yMax = supplyLimit.mul(2).div(etherMax);

    event Buy(address indexed user, uint eth, uint wad);
    event Sell(address indexed user, uint eth, uint wad);

    function () public payable {
        buy();
    }

    function buy() public payable {
        require(address(this).balance <= etherMax, "SUPPLY_LIMIT");

        uint256 y1 = yMax.sub(address(this).balance.mul(yMax).div(etherMax));
        uint256 y2 = yMax.sub(address(this).balance.sub(msg.value).mul(yMax).div(etherMax));
        uint256 wad = y2.add(y1).mul(msg.value).div(2);

        balances[msg.sender] = balances[msg.sender].add(wad);
        totalSupply_ = totalSupply_.add(wad);

        emit Buy(msg.sender, msg.value, wad);
    }

    function sell(uint256 wad) public {
        require(balances[msg.sender] >= wad, "BALANCE_ERROR");

        uint256 y1 = totalSupply_.mul(2).div(address(this).balance).sub(yMax);
        // uint256 y2 = val.mul(yMax).div(etherMax); 
        uint256 b22 = y1.mul(2)**2;
        uint256 wad8 = wad.mul(8);
        uint256 val = sqrt(b22.add(wad8.mul(yMax).div(etherMax))).sub(y1.mul(2)).mul(etherMax).div(yMax).div(2);

        balances[msg.sender] = balances[msg.sender].sub(wad);
        totalSupply_ = totalSupply_.sub(wad);
        
        msg.sender.transfer(val);
        
        emit Sell(msg.sender, val, wad);
    }

    function sqrt(uint256 x) internal pure returns (uint256 y) {
        if (x == 0) return 0;
        else if (x <= 3) return 1;
        uint z = (x + 1) / 2;
        y = x;
        while (z < y)
        {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}
