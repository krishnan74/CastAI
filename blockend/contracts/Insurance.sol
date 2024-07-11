// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract Insurance {
    struct Policy {
        address policyHolder;
        uint256 initialInvestment;
        uint256 thresholdPrice;
        uint256 totalPremiumPaid;
        uint256 startTime;
        bool isActive;
    }

    mapping(address => Policy) public policies;
    AggregatorV3Interface internal priceFeed;

    uint256 public premiumRate = 1; // 1% premium rate per month
    uint256 public claimPeriod = 30 days;

    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function createPolicy(uint256 _initialInvestment, uint256 _thresholdPrice) external payable {
        require(policies[msg.sender].isActive == false, "Policy already exists");
        require(msg.value >= _initialInvestment * premiumRate / 100, "Insufficient premium");

        policies[msg.sender] = Policy({
            policyHolder: msg.sender,
            initialInvestment: _initialInvestment,
            thresholdPrice: _thresholdPrice,
            totalPremiumPaid: msg.value,
            startTime: block.timestamp,
            isActive: true
        });
    }

    function payPremium() external payable {
        Policy storage policy = policies[msg.sender];
        require(policy.isActive, "No active policy");
        require(msg.value >= policy.initialInvestment * premiumRate / 100, "Insufficient premium");

        policy.totalPremiumPaid += msg.value;
    }

    function getLatestPrice() public view returns (int) {
        (, int price,,,) = priceFeed.latestRoundData();
        return price / 1e8; // Adjust based on the decimals of the price feed
    }

    function claim() external {
        Policy storage policy = policies[msg.sender];
        require(policy.isActive, "No active policy");
        require(block.timestamp <= policy.startTime + claimPeriod, "Claim period expired");
        require(getLatestPrice() < int(policy.thresholdPrice), "ETH price above threshold");

        policy.isActive = false;
        payable(policy.policyHolder).transfer(policy.initialInvestment + policy.totalPremiumPaid);
    }

    function cancelPolicy() external {
        Policy storage policy = policies[msg.sender];
        require(policy.isActive, "No active policy");

        policy.isActive = false;
        payable(policy.policyHolder).transfer(policy.totalPremiumPaid);
    }

    receive() external payable {}
}
