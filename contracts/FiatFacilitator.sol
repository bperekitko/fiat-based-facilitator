// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IGhoFacilitator.sol";
import "./interfaces/IGhoToken.sol";
import "./interfaces/AggregatorV3Interface.sol";
import "./libraries/PercentageMath.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FiatFacilitator is IGhoFacilitator, Ownable {
    using PercentageMath for uint256;

    IGhoToken public immutable GHO_TOKEN;
    address private _ghoTreasury;
    uint256 private _fee;
    AggregatorV3Interface private _reservesAggergator;

    constructor(
        address ghoToken,
        address ghoTreasury,
        address reservesAggreagator,
        uint fee
    ) Ownable(msg.sender) {
        GHO_TOKEN = IGhoToken(ghoToken);
        _updateGhoTreasury(ghoTreasury);
        _updateFee(fee);
        _reservesAggergator = AggregatorV3Interface(reservesAggreagator);
    }

    function isHealthy() public view returns (bool) {
        return _getReserves() > 1000; // TO DO implement
    }

    function getCurrentReserves() external view returns (int) {
        return _getReserves();
    }

    function distributeFeesToTreasury() external override onlyOwner {
        // TODO implement me
    }

    function updateGhoTreasury(
        address newGhoTreasury
    ) external override onlyOwner {
        _updateGhoTreasury(newGhoTreasury);
    }

    function getGhoTreasury() external view override returns (address) {
        return _ghoTreasury;
    }

    function updateFee(uint256 newFee) external onlyOwner {
        _updateFee(newFee);
    }

    function _getReserves() internal view returns (int) {
        (, int answer, , , ) = _reservesAggergator.latestRoundData();
        return answer;
    }

    function _updateGhoTreasury(address newGhoTreasury) internal {
        address oldGhoTreasury = _ghoTreasury;
        _ghoTreasury = newGhoTreasury;
        emit GhoTreasuryUpdated(oldGhoTreasury, newGhoTreasury);
    }

    function _updateFee(uint256 newFee) internal {
        require(newFee <= 10000, "Cannot set fee bigger than 100%");
        _fee = newFee;
    }
}
