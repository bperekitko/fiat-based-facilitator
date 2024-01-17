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
    uint256 private _fee = 1;
    AggregatorV3Interface private _reservesAggergator;

    event FiatMint(uint256 indexed amount, uint256 fee);

    constructor(
        address ghoToken,
        address ghoTreasury,
        address reservesAggreagator
    ) Ownable(msg.sender) {
        GHO_TOKEN = IGhoToken(ghoToken);
        _updateGhoTreasury(ghoTreasury);
        _reservesAggergator = AggregatorV3Interface(reservesAggreagator);
    }

    function mint(uint amount) external onlyOwner {
        (, uint bucketLevel) = GHO_TOKEN.getFacilitatorBucket(address(this));
        require(
            bucketLevel + amount <= uint(_getReserves()),
            "Not enough reserves to mint new tokens"
        );
        GHO_TOKEN.mint(address(this), amount);
        uint fee = _calculateFee(amount);
        GHO_TOKEN.transfer(owner(), amount - fee);

        emit FiatMint(amount, fee);
    }

    function burn(uint amount) external onlyOwner {
        bool result = GHO_TOKEN.transferFrom(owner(), address(this), amount);
        require(result, "Could not transfer tokens from owner to burn");
        GHO_TOKEN.burn(amount);
    }

    function isHealthy() public view returns (bool) {
        (, uint bucketLevel) = GHO_TOKEN.getFacilitatorBucket(address(this));
        int currentReservers = _getReserves();

        return currentReservers > 0 && uint(currentReservers) >= bucketLevel;
    }

    function getCurrentReserves() external view returns (int) {
        return _getReserves();
    }

    function distributeFeesToTreasury() external override onlyOwner {
        uint256 balance = GHO_TOKEN.balanceOf(address(this));
        GHO_TOKEN.transfer(_ghoTreasury, balance);
        emit FeesDistributedToTreasury(
            _ghoTreasury,
            address(GHO_TOKEN),
            balance
        );
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

    function _calculateFee(uint256 amount) internal view returns (uint256) {
        return amount.percentMul(_fee);
    }
}
