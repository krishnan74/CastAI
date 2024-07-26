# CastAI 

CastAI is a farcaster frame application that allows users to interact with AI characters (fictional or non-fictional) through a chat interface. Leveraging Galadriel OpenAI, CastAI provides a unique platform where users can engage in conversations with customized AI personas, enhancing their social experience on Farcaster.

#Important Links:
Site Link: https://cast-ai.vercel.app/
Frame Server: https://cast-ai-frame.vercel.app/
BASE Sepolia Contract Address: 0xBB5d5456414Ad834f93c3361750c2775bbd72a93
Galadriel DALLE Agent Address: 0x7335bb6bEF7218751f9cECc06aB3295673c734CC
Galadriel ChatGPT Agent Address: 0x84B6a71F2268A6EA166e3A3d060cD8E9D6180024

## Features 
 
- **AI Character Creation** : Creators can design AI characters by sending GAL tokens to a smart contract and providing details such as character name, description, and personality traits.
 
- **Interactive Chat Interface** : Users can chat with these AI characters for free. To unlock advanced personality traits, users must pay ETH, which directly benefits the character creators.
 
- **Monetization Model** : The integration of GAL tokens and ETH payments encourages a vibrant economy within the Farcaster ecosystem, rewarding content creators and driving engagement.

You can use the hosted site https://cast.ai.vercel.app to create your AI character or run it in local environment by following the steps below, 

## Installation 
 
1. Clone the repository:


```bash
git clone https://github.com/krishnan74/CastAI.git
cd frontend
```
 
2. Install dependencies:

```bash
npm install
```
 
3. Set up environment variables:
Create a `.env` file in the root directory and add your configuration:

```bash
NEXT_PUBLIC_BASE_CONTRACT_ADDRESS="0xBB5d5456414Ad834f93c3361750c2775bbd72a93"
NEXT_PUBLIC_AGENT_CONTRACT_ADDRESS="0x7335bb6bEF7218751f9cECc06aB3295673c734CC"
NEXT_PUBLIC_AGENT_PR_ADDRESS = "84f56b944266554f4576c7149675bec841908e51148389208ab4276f567d72b2"
NEXT_PUBLIC_URL = <YOUR_ACCESSIBLE_NGROK_LINK>
```

Note: for the NEXT_PUBLIC_URL use ngrok to make your localhost to publibly accessible and use that link
 
4. Start the application:

```bash
npm run dev
```

## Usage
 
1. **Creating AI Characters** :
   
  - Provide character details including name, description, and personality traits.

  - Send GAL tokens to the intermediary account.
  
  - Cast the created AI Character as a frame in warpcast.
 
2. **Interacting with AI Characters** :
   
  - Warpcast Users can chat with the AI characters for free.

  - To enable advanced personality traits, users pay ETH to the smart contract, which is transferred to the character's creator.

3. **Withdrawing the ETH Earned** :

   - Creators verify their identity using Reclaim Protocol to double their rewards.
  
   - Creators withdraw the amount earned by the specific character and get rewarded.

