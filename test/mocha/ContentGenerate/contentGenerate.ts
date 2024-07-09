import dotenv from 'dotenv';
import Startup from '../../../app'
import request from 'supertest';
import {resolveCourseOutlineFromOpenAI} from '../../../app/ContentGenerate/contentGenerateController'

before(function() {
    // Load environment variables from .env file
    dotenv.config();

});

const resolveQuiz = (openAiQuizStr)=>{
    const jsonStartIndex = openAiQuizStr.indexOf('[');
    const jsonEndIndex = openAiQuizStr.lastIndexOf(']') + 1;
    const trimmedJsonString = openAiQuizStr.substring(jsonStartIndex, jsonEndIndex);
    // Parse the string as JSON
    const jsonObject = JSON.parse(trimmedJsonString);

    // Output the JSON object
    //console.log(jsonObject);
}

describe('Content Generate By AI', () => {
    let serverObj = new Startup();
    beforeEach((done) => {

        done();      
    });
    describe('/POST gen course outline', async () => {
        it.skip('it should save user info', (done) => {
            const openAiReturn = "Certainly! Based on the provided user background and preferences, here's a customized course outline for blockchain and Web3 knowledge:\n\n**A. Introduction to Blockchain Technology**\n   subtopic.A.1. History and Evolution of Blockchain\n   subtopic.A.2. Understanding Decentralization\n   subtopic.A.3. Key Concepts: Blocks, Miners, and Nodes\n   subtopic.A.4. Types of Blockchains: Public, Private, Consortium, and Hybrid\n   subtopic.A.5. Consensus Mechanisms: Proof of Work, Proof of Stake, and others\n\n**B. Cryptography in Blockchain**\n   subtopic.B.1. Basics of Cryptography\n   subtopic.B.2. Public Key Infrastructure (PKI)\n   subtopic.B.3. Hash Functions and Merkle Trees\n   subtopic.B.4. Digital Signatures and their Role in Blockchain\n\n**C. Smart Contracts and Decentralized Applications (DApps)**\n   subtopic.C.1. Introduction to Smart Contracts\n   subtopic.C.2. Platforms for Smart Contracts: Ethereum, EOS, etc.\n   subtopic.C.3. Developing Simple Smart Contracts (Solidity for Ethereum)\n   subtopic.C.4. Introduction to Decentralized Applications (DApps)\n   subtopic.C.5. Lifecycle of a DApp\n\n**D. Ethereum Ecosystem**\n   subtopic.D.1. Understanding Ethereum\n   subtopic.D.2. Ether: Ethereum's Cryptocurrency\n   subtopic.D.3. Ethereum Virtual Machine (EVM)\n   subtopic.D.4. Gas and Transaction Fees\n   subtopic.D.5. ERC Standards (E.G., ERC-20, ERC-721)\n\n**E. Web3 Technologies**\n   subtopic.E.1. Introduction to Web3\n   subtopic.E.2. Web3.js and Ethers.js Libraries\n   subtopic.E.3. Interacting with Smart Contracts through Web3\n   subtopic.E.4. Decentralized Finance (DeFi) Overview\n   subtopic.E.5. Non-Fungible Tokens (NFTs): Concept and Technicalities\n\n**F. Decentralized Finance (DeFi)**\n   subtopic.F.1. Understanding DeFi Components\n   subtopic.F.2. Lending, Borrowing, and Yield Farming\n   subtopic.F.3. DeFi Protocols and Platforms\n   subtopic.F.4. Risks and Challenges in DeFi\n   subtopic.F.5. Future Trends in DeFi\n\n**G. Blockchain Scalability and Interoperability**\n   subtopic.G.1. Scalability Issues in Blockchain\n   subtopic.G.2. Solutions: Layer 2 Scaling, Sharding\n   subtopic.G.3. Interoperability between Blockchains\n   subtopic.G.4. Cross-Chain Technologies\n\n**H. Blockchain Security**\n   subtopic.H.1. Common Security Threats in Blockchain\n   subtopic.H.2. Best Practices for Blockchain Security\n   subtopic.H.3. Smart Contract Vulnerabilities\n   subtopic.H.4. Security Tools and Audits\n\n**I. Regulatory and Ethical Considerations**\n   subtopic.I.1. Regulatory Landscape for Blockchain and Cryptocurrencies\n   subtopic.I.2. Privacy Issues and Solutions in Blockchain\n   subtopic.I.3. Ethical Considerations in Blockchain Development\n\n**J. Future Trends and Innovations in Blockchain and Web3**\n   subtopic.J.1. Emerging Technologies in the Blockchain Space\n   subtopic.J.2. Decentralized Autonomous Organizations (DAOs)\n   subtopic.J.3. The Role of Artificial Intelligence in Web3\n   subtopic.J.4. Potential Future Applications of Blockchain Technology\n\nThis course is designed to provide a comprehensive understanding of blockchain and Web3 technologies, tailored to individuals with a technical background and an explorative learning stylsubtopic.E. It covers the foundational concepts, practical applications, and future trends, ensuring a well-rounded knowledge base."
            
            const outline = resolveCourseOutlineFromOpenAI(openAiReturn);

            //console.log(`COURSE OUTLINE: \n${ JSON.stringify(outline)}`);
            done();
        });

        it('it should resolve the quiz the array list of object', (done)=>{
            const quizStr = "```json\n[\n  {\n    \"question\": \"Who is the anonymous entity behind the creation of Bitcoin?\",\n    \"choices\": {\n      \"A\": \"Vitalik Buterin\",\n      \"B\": \"Satoshi Nakamoto\",\n      \"C\": \"Gavin Wood\",\n      \"D\": \"Charlie Lee\"\n    },\n    \"answer\": \"B\"\n  },\n  {\n    \"question\": \"What is the primary purpose of ETH in the Ethereum network?\",\n    \"choices\": {\n      \"A\": \"To act as a stablecoin\",\n      \"B\": \"To pay for transaction fees and computational services\",\n      \"C\": \"To be used exclusively for smart contracts\",\n      \"D\": \"To replace Bitcoin\"\n    },\n    \"answer\": \"B\"\n  },\n  {\n    \"question\": \"In what year was Ethereum launched?\",\n    \"choices\": {\n      \"A\": \"2009\",\n      \"B\": \"2013\",\n      \"C\": \"2015\",\n      \"D\": \"2017\"\n    },\n    \"answer\": \"C\"\n  },\n  {\n    \"question\": \"What is a smart contract?\",\n    \"choices\": {\n      \"A\": \"A legal document\",\n      \"B\": \"A self-executing contract with the terms directly written into code\",\n      \"C\": \"A traditional financial agreement\",\n      \"D\": \"A type of cryptocurrency\"\n    },\n    \"answer\": \"B\"\n  },\n  {\n    \"question\": \"What is the main innovation introduced by Bitcoin?\",\n    \"choices\": {\n      \"A\": \"Decentralized computing\",\n      \"B\": \"Smart contracts\",\n      \"C\": \"Decentralized, peer-to-peer digital currency\",\n      \"D\": \"Decentralized applications (DApps)\"\n    },\n    \"answer\": \"C\"\n  },\n  {\n    \"question\": \"Who is credited with the creation of Ethereum?\",\n    \"choices\": {\n      \"A\": \"Satoshi Nakamoto\",\n      \"B\": \"Vitalik Buterin\",\n      \"C\": \"Charlie Lee\",\n      \"D\": \"Gavin Wood\"\n    },\n    \"answer\": \"B\"\n  },\n  {\n    \"question\": \"What term is used to describe the fee paid for transactions on the Ethereum network?\",\n    \"choices\": {\n      \"A\": \"Ether\",\n      \"B\": \"Bitcoin\",\n      \"C\": \"Gas\",\n      \"D\": \"Token\"\n    },\n    \"answer\": \"C\"\n  },\n  {\n    \"question\": \"Which of the following is NOT a use case for ETH?\",\n    \"choices\": {\n      \"A\": \"Collateral in DeFi applications\",\n      \"B\": \"Fuel for transactions\",\n      \"C\": \"Incentive for miners\",\n      \"D\": \"Centralized banking transactions\"\n    },\n    \"answer\": \"D\"\n  },\n  {\n    \"question\": \"What is the primary difference between Bitcoin and Ethereum?\",\n    \"choices\": {\n      \"A\": \"Bitcoin supports smart contracts, Ethereum does not\",\n      \"B\": \"Ethereum supports smart contracts, Bitcoin does not\",\n      \"C\": \"Bitcoin is a platform for decentralized applications, Ethereum is not\",\n      \"D\": \"Ethereum is primarily a digital currency, Bitcoin is not\"\n    },\n    \"answer\": \"B\"\n  },\n  {\n    \"question\": \"What does DApp stand for?\",\n    \"choices\": {\n      \"A\": \"Digital Application\",\n      \"B\": \"Decentralized Application\",\n      \"C\": \"Distributed Application\",\n      \"D\": \"Dynamic Application\"\n    },\n    \"answer\": \"B\"\n  }\n]\n```"
        
            resolveQuiz(quizStr);
        }); 
    });
});