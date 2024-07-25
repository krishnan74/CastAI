// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract AICharacterPlatform {

    //declaring the feeAmount
    uint256 feeAmount;

    //defining the struct for the AICharacter
    struct AICharacter {
        string name;
        string characterId;
        string picURL;
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

    //array of all the characterIds created by every creators
    string[] allCharacterIds;

    //maps the characterId to the corresponding AICharacter
    mapping(string => AICharacter) public characters;

    //maps the creator address to their corresponding created AICharacters
    mapping(address => AICharacter[]) private userCharacters;

    //events emitted for all the functions
    event CharacterCreated(
        string name,
        string indexed characterId,
        string picURL,
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

    //constructor to assign the feeAmount to be paid by the users interacting with the AICharacters
    constructor(uint256 _feeAmount) {
        feeAmount = _feeAmount;
    }

    //function to create an AI character and store it in the mappings
    function createCharacter(
        string memory _name,
        string memory _characterId,
        string memory _picUrl,
        string memory _personality1,
        string memory _personality2,
        string memory _personality3,
        string memory _description
    ) external {
        AICharacter memory newCharacter = AICharacter({
            name: _name,
            characterId: _characterId,
            picURL: _picUrl,
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
        allCharacterIds.push(_characterId);
        characters[_characterId] = newCharacter;

        emit CharacterCreated(
            _name,
            _characterId,
            _picUrl,
            msg.sender,
            _personality1,
            _personality2,
            _personality3,
            _description
        );

    }

    //function to enable one of the three personalities of the AICharacter, It requires the sender to send 
    function enablePersonality(uint256 _index, string memory _characterId) external payable {
        
        require(msg.value >= feeAmount , "Insufficient Fee Amount");
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

    //function to disable one of the three personalities of the AICharacter.
    function disablePersonality(uint256 _index, string memory _characterId) external {

        if (_index == 1) {
            characters[_characterId].personality1Enabled = false;
        } else if (_index == 2) {
            characters[_characterId].personality2Enabled = false;
        } else if (_index == 3) {
            characters[_characterId].personality3Enabled = false;
        } 

     }
    
    //function to withdraw the ETH earned by the AICharacter, if verified their in real life identity using Reclaim Protocol creator can double their rewards
    function withdraw(string memory _characterId, bool isVerified) external {
        require( msg.sender == characters[_characterId].owner, "Only owner can withdraw the ETH earned by the AI Character" );
        
        uint256 amount = characters[_characterId].etherEarned;
        
        //reseting the ethEarned by the AICharacter to zero
        characters[_characterId].etherEarned = 0;

        if (isVerified) {
            // Verified withdrawal (doubling the amount)
            payable(msg.sender).transfer(amount * 2);
            emit Withdrawal(_characterId, msg.sender, amount * 2);
        } else {
            // Normal withdrawal
            payable(msg.sender).transfer(amount);
            emit Withdrawal(_characterId, msg.sender, amount);
        }
    }


    //function to get the number of AICharacters created by the user
    function getUserCharacterCount(address _user) external view returns (uint256) {
        return userCharacters[_user].length;
    }

    //function to get the details of the AICharacter using the characterId
    function getCharacterDetails(string memory _characterId) external view returns (AICharacter memory){
        return characters[_characterId];
    }

    //function to get the AICharacters created by the creator using the the creator Address
    function getUserCharacters(address _user) external view returns (AICharacter[] memory) {
        return userCharacters[_user];
    }

    //function to get all the AICharacters IDS that have been created by all the Creators 
    function getAllCharacters() external view returns (string[] memory){
        return allCharacterIds;
    }

    //function to get the personalities which have been enabled of the AICharacter using the characterId
    function getEnabledPersonalities(string memory _characterId) external view returns (string memory) {
        string memory personalities = "";

        AICharacter memory character = characters[_characterId];

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

    function setFeeAmount (uint256 _newFeeAmount) external{
        feeAmount = _newFeeAmount;
    }

    receive() external payable {}

    fallback() external payable {}

}
