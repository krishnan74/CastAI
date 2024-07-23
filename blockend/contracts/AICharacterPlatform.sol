// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Agent.sol";

contract AICharacterPlatform is ReentrancyGuard {
    struct AICharacter {
        string name;
        string characterId;
        address owner;
        string personality1;
        string personality2;
        string personality3;
        string description;
        uint256 etherEarned;
        bool personality1Enabled;
        bool personality2Enabled;
        bool personality3Enabled;
    }

    mapping(string => AICharacter) public characters;
    mapping(address => AICharacter[]) private userCharacters;
    mapping(string => uint) public characterToAgentRunId;


    uint256 public feeAmount;
    address public agentAddress;
    Agent agent;

    event CharacterCreated(
        string indexed characterId,
        string name,
        address owner,
        string personality1,
        string personality2,
        string personality3,
        string description
    );
    event FeePaid(address indexed user, string indexed characterId, uint256 amount);
    event Withdrawal(string indexed characterId, address indexed owner, uint256 amount);
    event ChatPromptReceived(string indexed characterId, string prompt);
    event ChatConcatenatedMessage(string message);

    constructor(uint256 _feeAmount) {
        feeAmount = _feeAmount;
    }

    function createCharacter(
        string memory _name,
        string memory _characterId,
        string memory _personality1,
        string memory _personality2,
        string memory _personality3,
        string memory _description
    ) external {
        AICharacter memory newCharacter = AICharacter({
            name: _name,
            characterId: _characterId,
            owner: msg.sender,
            personality1: _personality1,
            personality2: _personality2,
            personality3: _personality3,
            description: _description,
            etherEarned: 0,
            personality1Enabled: false,
            personality2Enabled: false,
            personality3Enabled: false

        });

        userCharacters[msg.sender].push(newCharacter);
        characters[_characterId] = newCharacter;

        emit CharacterCreated(
            _characterId,
            _name,
            msg.sender,
            _personality1,
            _personality2,
            _personality3,
            _description
        );

    }

    
    function enablePersonality(uint256 _index, string memory _characterId) external payable {
        require(bytes(characters[_characterId].characterId).length != 0, "Character does not exist");
        require(_index >= 1 && _index <= 3, "Invalid personality index");

        require(msg.value == feeAmount, "Ether value must be greater than 0");

        

        if (_index == 1) {
            characters[_characterId].personality1Enabled = true;
        } else if (_index == 2) {
            characters[_characterId].personality2Enabled = true;
        } else if (_index == 3) {
            characters[_characterId].personality3Enabled = true;
        } 

        characters[_characterId].etherEarned += msg.value;
        emit FeePaid(msg.sender, _characterId, msg.value);
    }

     function disablePersonality(uint256 _index, string memory _characterId) external {
        require(bytes(characters[_characterId].characterId).length != 0, "Character does not exist");
        require(_index >= 1 && _index <= 3, "Invalid personality index");

        if (_index == 1) {
            characters[_characterId].personality1Enabled = false;
        } else if (_index == 2) {
            characters[_characterId].personality2Enabled = false;
        } else if (_index == 3) {
            characters[_characterId].personality3Enabled = false;
        } 

     }
    

    function withdraw(string memory _characterId) external nonReentrant {
        require(msg.sender == characters[_characterId].owner, "Not the owner");
        uint256 amount = characters[_characterId].etherEarned;
        characters[_characterId].etherEarned = 0;
        payable(msg.sender).transfer(amount);

        emit Withdrawal(_characterId, msg.sender, amount);
    }

    
    function getUserCharacterCount(address _user) external view returns (uint256) {
        return userCharacters[_user].length;
    }

    function getCharacterDetails(string memory _characterId) external view returns (AICharacter memory){
        return characters[_characterId];
    }

    function getUserCharacters(address _user) external view returns (AICharacter[] memory) {
        return userCharacters[_user];
    }

    function setFeeAmount( uint256 _feeAmount) external {
        feeAmount = _feeAmount;
    }

    function getEnabledPersonalities(AICharacter memory character) internal pure returns (string memory) {
        string memory personalities = "";
        if (character.personality1Enabled) {
            personalities = string(abi.encodePacked(personalities, character.personality1, ", "));
        }
        if (character.personality2Enabled) {
            personalities = string(abi.encodePacked(personalities, character.personality2, ", "));
        }
        if (character.personality3Enabled) {
            personalities = string(abi.encodePacked(personalities, character.personality3, ", "));
        }
        
        bytes memory personalitiesBytes = bytes(personalities);
        if (personalitiesBytes.length > 2) {
            personalitiesBytes[personalitiesBytes.length - 2] = 0; 
        }
        return string(personalitiesBytes);
    }

    receive() external payable {}

    fallback() external payable {}

}
