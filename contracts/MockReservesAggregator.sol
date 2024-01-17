// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/AggregatorV3Interface.sol";

contract MockReservesAggregator is Ownable, AggregatorV3Interface {
    int private reserves = 0;

    constructor() Ownable(msg.sender) {}

    function increaseReserves(int amount) external onlyOwner {
        require(amount >= 0);
        reserves += amount;
    }

    function decreaseReserves(int amount) external onlyOwner {
        require(amount >= 0);
        reserves -= amount;
        if(reserves < 0){
            reserves = 0;
        }
    }

    function decimals() external pure override returns (uint8) {
        return 18;
    }

    function description() external pure override returns (string memory) {
        return "Mocked implemenation for testing purposes";
    }

    function version() external pure override returns (uint256) {
        return 1;
    }

    function getRoundData(
        uint80 _roundId
    )
        external
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (_roundId, reserves, 1, 1, 1);
    }

    function latestRoundData()
        external
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (1, reserves, 1, 1, 1);
    }
}
