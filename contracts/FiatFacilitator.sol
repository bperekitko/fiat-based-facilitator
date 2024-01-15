// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IGhoFacilitator.sol";
import "./interfaces/IGhoToken.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FiatFacilitator is IGhoFacilitator, Ownable {
    IGhoToken public immutable GHO_TOKEN;

    constructor(address ghoToken) Ownable(msg.sender) {
        GHO_TOKEN = IGhoToken(ghoToken);
    }

    function distributeFeesToTreasury() external override {}

    function updateGhoTreasury(address newGhoTreasury) external override {}

    function getGhoTreasury() external view override returns (address) {}
}
