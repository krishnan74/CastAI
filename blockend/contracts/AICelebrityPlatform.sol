// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AICelebrityPlatform is ReentrancyGuard {
    struct AICeleb {
        string name;
        string celebId;
        address owner;
        string personality1;
        string personality2;
        string personality3;
        string personality4;
        
        uint256 etherEarned;
        bool personality1Enabled;
        bool personality2Enabled;
        bool personality3Enabled;
        bool personality4Enabled;
    }

    mapping(string => AICeleb) public celebs;
    mapping(address => AICeleb[]) private userCelebs;

    uint256 public feeAmount;

    event CelebCreated(
        string indexed celebId,
        string name,
        address owner,
        string personality1,
        string personality2,
        string personality3,
        string personality4,
        string description
    );
    event FeePaid(address indexed user, string indexed celebId, uint256 amount);
    event Withdrawal(string indexed celebId, address indexed owner, uint256 amount);

    constructor(uint256 _feeAmount) {
        feeAmount = _feeAmount;
    }

    function createCeleb(
        string memory _name,
        string memory _celebId,
        string memory _personality1,
        string memory _personality2,
        string memory _personality3,
        string memory _personality4,
        string memory _description
    ) external {
        AICeleb memory newCeleb = AICeleb({
            name: _name,
            celebId: _celebId,
            owner: msg.sender,
            personality1: _personality1,
            personality2: _personality2,
            personality3: _personality3,
            personality4: _personality4,
        
            etherEarned: 0,
            personality1Enabled: false,
            personality2Enabled: false,
            personality3Enabled: false,
            personality4Enabled: false
        });

        userCelebs[msg.sender].push(newCeleb);
        celebs[_celebId] = newCeleb;

        emit CelebCreated(
            _celebId,
            _name,
            msg.sender,
            _personality1,
            _personality2,
            _personality3,
            _personality4,
            _description
        );

        
    }

    
     function enablePersonality(uint256 _index, string memory _celebId) external payable {
        require(bytes(celebs[_celebId].celebId).length != 0, "Celeb does not exist");
        require(_index >= 1 && _index <= 4, "Invalid personality index");

        require(msg.value == feeAmount, "Ether value must be greater than 0");

        

        if (_index == 1) {
            celebs[_celebId].personality1Enabled = true;
        } else if (_index == 2) {
            celebs[_celebId].personality2Enabled = true;
        } else if (_index == 3) {
            celebs[_celebId].personality3Enabled = true;
        } else {
            celebs[_celebId].personality4Enabled = true;
        }

        celebs[_celebId].etherEarned += msg.value;
        emit FeePaid(msg.sender, _celebId, msg.value);
    }

     function disablePersonality(uint256 _index, string memory _celebId) external payable {
        require(bytes(celebs[_celebId].celebId).length != 0, "Celeb does not exist");
        require(_index >= 1 && _index <= 4, "Invalid personality index");

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

  
    function getUserCelebCount(address _user) external view returns (uint256) {
        return userCelebs[_user].length;
    }

    function getCelebDetails(string memory _celebId) external view returns (AICeleb memory){
        return celebs[_celebId];

    }

    
    function getUserCelebs(address _user) external view returns (AICeleb[] memory) {
        return userCelebs[_user];
    }

    function withdraw(string memory _celebId) external  nonReentrant {
        require(msg.sender == celebs[_celebId].owner, "Not the owner");
        uint256 amount = celebs[_celebId].etherEarned;
        celebs[_celebId].etherEarned = 0;
        payable(msg.sender).transfer(amount);

        emit Withdrawal(_celebId, msg.sender, amount);
    }

    receive() external payable {}

    fallback() external payable {}
}
