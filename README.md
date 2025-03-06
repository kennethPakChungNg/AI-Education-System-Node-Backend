# AI Education System - Node.js Backend

This repository contains the backend implementation for the AI Education System, a platform that leverages generative AI to create personalized blockchain and Web3 learning experiences. Built for the Theta Network 2024 Hackathon, this system demonstrates how AI can revolutionize education by adapting to each learner's background, interests, and learning style.

## 📋 Overview

The AI Education System backend provides the intelligence and data management for an adaptive learning platform. It uses large language models (LLMs) to generate customized course content, answer student questions, create quizzes, and provide explanations—all tailored to the individual learner's profile.

Key features:
- User profile management with learning preferences and background information
- AI-powered course outline generation based on user characteristics
- Conversational learning through an AI tutor
- Automated quiz generation and assessment
- Integration with Theta EdgeCloud for AI model inference
- Blockchain-based authentication using Theta wallet addresses

## 🏗️ Architecture

The backend is built as a Node.js/Express application with TypeScript, providing a RESTful API that powers the React frontend. It integrates with multiple AI services and uses MongoDB for data persistence.

### System Components

```
┌─────────────────┐      ┌───────────────────┐     ┌─────────────────┐
│  React Frontend │────▶│  Express Backend  │────▶│  MongoDB Atlas  │
└─────────────────┘      └───────────────────┘     └─────────────────┘
                               │    │
                               │    │
                 ┌─────────────┘    └──────────────┐
                 ▼                                 ▼
        ┌─────────────────┐               ┌─────────────────────┐
        │   OpenAI APIs   │               │ Theta EdgeCloud AI  │
        └─────────────────┘               └─────────────────────┘
```

### Module Structure

- **User Operations**: Manages user profiles, learning preferences, and academic backgrounds
- **Course Outline**: Handles generation and storage of personalized curriculum structures
- **Content Generation**: Interfaces with AI models to create learning materials
- **Conversation**: Maintains the history and state of learning dialogues
- **Quiz**: Generates assessments and processes student responses

## 🚀 API Endpoints

The backend exposes several RESTful endpoints grouped by functionality:

### User Management
- `POST /userInfo/storeUserBackground`: Store user profile and learning preferences
- `POST /userInfo/queryUserBackgroundByAddress`: Retrieve user profile data

### Course Management
- `POST /courseOutline/saveCourseOutline`: Save a generated course outline
- `POST /courseOutline/queryCourseOutline`: Retrieve course outlines
- `POST /courseOutline/updateCourseName`: Update course name
- `POST /courseOutline/updateLearningStatus`: Update completion status of topics

### AI Content Generation
- `POST /aiGen/genCourseOutline`: Generate a personalized course outline
- `POST /aiGen/answerUserQuestion`: Get AI tutor responses to user questions
- `POST /aiGen/generateQuiz`: Create assessment quizzes based on learned material
- `POST /aiGen/genEducateImage`: Generate educational images using AI

### Learning Conversations
- `POST /conversation/saveSingleEduConversation`: Store conversation exchanges
- `POST /conversation/queryEduConversation`: Retrieve conversation history

### Quiz and Assessment
- `POST /quiz/calQuizResult`: Calculate quiz results and provide explanations

## 💻 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: 
  - OpenAI API (GPT-4o)
  - Theta EdgeCloud (Gemma-2B)
  - Stable Diffusion (via Theta EdgeCloud)
- **Blockchain**: Theta Network (TNT-721 NFT standard)
- **Authentication**: Wallet-based authentication

## 🔧 Setup and Installation

### Prerequisites
- Node.js (v16+)
- MongoDB instance
- OpenAI API key
- Theta EdgeCloud API access

### Environment Variables
Create a `.env` file with the following configuration:
```
PORT=5000
SERVER_MONGODB_URL=mongodb://[username]:[password]@[host]:[port]/[database]
OPENAI_API_KEY=your_openai_api_key
THETA_VIDEO_APIKEY=your_theta_video_api_key
THETA_VIDEO_SECRET=your_theta_video_secret
```

### Installation Steps
1. Clone the repository
```bash
git clone https://github.com/your-username/AI-Education-System-Node-Backend.git
cd AI-Education-System-Node-Backend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run startdev
```

The server will be available at `http://localhost:5000`.

## 🧠 AI Content Generation

The system leverages several AI models to create personalized educational content:

### Course Outline Generation
Uses GPT-4o to analyze a user's background and generate a tailored curriculum structure suitable for their experience level and interests.

### Conversational Learning
Implements a context-aware tutoring system that maintains dialogue history and adjusts explanations based on the user's questions and understanding.

### Quiz Generation & Feedback
Automatically creates assessments based on learning material and provides explanations for correct and incorrect answers.

### Visual Learning Support
Generates educational illustrations using Stable Diffusion to supplement text-based learning.

## 🔐 Smart Contract Integration

The project includes TNT-721 compatible smart contracts for potential future features:
- Educational credential NFTs
- Course completion certificates
- Learning achievement badges

## 🤝 Contributors

- [kennethPakChungNg](https://github.com/kennethPakChungNg) - Full Stack Developer
- [web3hugo1225](https://github.com/web3hugo1225) - Full Stack Developer

## 🏆 Theta Hackathon 2024

This project was created for the Theta Network 2024 Hackathon in the Generative AI track. It demonstrates the potential of combining blockchain technology with AI-powered education systems.

## 📄 License

[MIT License](LICENSE)
