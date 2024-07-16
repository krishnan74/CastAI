// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AICelebrityPlatform is ReentrancyGuard {
    struct AICeleb {
        string name;
        address owner;
        string personality1;
        string personality2;
        string personality3;
        string personality4;
        string description;
        uint256 etherEarned;
        bool personality1Enabled;
        bool personality2Enabled;
        bool personality3Enabled;
        bool personality4Enabled;
    }

    uint256 public celebsCount = 1;
    mapping(uint256 => AICeleb) public celebs;
    mapping(address => AICeleb[]) private userCelebs;

    uint256 public feeAmount;

    event CelebCreated(
        uint256 indexed celebId,
        string name,
        address owner,
        string personality1,
        string personality2,
        string personality3,
        string personality4,
        string description
    );
    event FeePaid(address indexed user, uint256 indexed celebId, uint256 amount);
    event Withdrawal(uint256 indexed celebId, address indexed owner, uint256 amount);

    constructor(uint256 _feeAmount) {
        feeAmount = _feeAmount;
    }

    function createCeleb(
        string memory _name,
        string memory _personality1,
        string memory _personality2,
        string memory _personality3,
        string memory _personality4,
        string memory _description
    ) external {
        AICeleb memory newCeleb = AICeleb({
            name: _name,
            owner: msg.sender,
            personality1: _personality1,
            personality2: _personality2,
            personality3: _personality3,
            personality4: _personality4,
            description: _description,
            etherEarned: 0,
            personality1Enabled: false,
            personality2Enabled: false,
            personality3Enabled: false,
            personality4Enabled: false
        });

        userCelebs[msg.sender].push(newCeleb);
        celebs[celebsCount] = newCeleb;

        emit CelebCreated(
            celebsCount,
            _name,
            msg.sender,
            _personality1,
            _personality2,
            _personality3,
            _personality4,
            _description
        );

        celebsCount++;
    }

    
    function enablePersonality(uint256 _index, uint256 _celebId) public {
        
        if (_index == 1) {
            celebs[_celebId].personality1Enabled = true;
        } else if (_index == 2) {
            celebs[_celebId].personality2Enabled = true;
        } else if (_index == 3) {
            celebs[_celebId].personality3Enabled = true;
        } else {
            celebs[_celebId].personality4Enabled = true;
        }
    }

    function disablePersonality(uint256 _index, uint256 _celebId) public {
        
        if (_index == 1) {
            celebs[_celebId].personality1Enabled = false;
        } else if (_index == 2) {
            celebs[_celebId].personality2Enabled = false;
        } else if (_index == 3) {
            celebs[_celebId].personality3Enabled = false;
        } else {
            celebs[_celebId].personality4Enabled = false;
        }
    }

    function payFee(uint256 _celebId) external payable nonReentrant {
        require(_celebId < celebsCount, "Invalid celeb ID");
        require(msg.sender != celebs[_celebId].owner, "Owner can't pay fee");
        require(msg.value == feeAmount, "Incorrect fee amount");

        celebs[_celebId].etherEarned += msg.value;

        emit FeePaid(msg.sender, _celebId, msg.value);
    }

  
    function getUserCelebCount(address _user) external view returns (uint256) {
        return userCelebs[_user].length;
    }

    
    function getUserCelebs(address _user) external view returns (AICeleb[] memory) {
        return userCelebs[_user];
    }

    function withdraw(uint256 _celebId) public nonReentrant {
        require(msg.sender == celebs[_celebId].owner, "Not the owner");
        uint256 amount = celebs[_celebId].etherEarned;
        celebs[_celebId].etherEarned = 0;
        payable(msg.sender).transfer(amount);

        emit Withdrawal(_celebId, msg.sender, amount);
    }

    receive() external payable {}

    fallback() external payable {}
}
