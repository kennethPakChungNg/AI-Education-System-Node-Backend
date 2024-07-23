import axios,{AxiosResponse } from 'axios';
import {logger} from '../common'
import { llmModel } from './contenGenerateApiSchema';
import OpenAI from "openai";

const OPENAI_API_BASE_URL = 'https://api.openai.com'


const genCourseOutlineByOpenAI = async( userBackground: any, TopicName : string, LastGeneratedCourseOutline:any, UserComment: string)=>{
    logger.info("Start openAi course outline generation.")
    const apiKey = process.env.OPENAI_API_KEY
    const url = `${OPENAI_API_BASE_URL}/v1/chat/completions`

    logger.info("Generating prompt.")
    const data = {
        'model': 'gpt-4o',
        'messages': [
            {"role": "system", "content": getPrompt_courseOutline(userBackground, TopicName, LastGeneratedCourseOutline, UserComment)},
            {"role": "user", "content": "Want a course outline of blockchain/ Web3 knowledge. "}
        ],
        'max_tokens': 1000,
        'temperature': 0.5 
    }
  

    const headers = {'Authorization': `Bearer ${apiKey}`}
    
    logger.info("Request openAi analysis.")
    const response:AxiosResponse  = await axios.post(url,data, {headers} );
    if ( response.status == 200 ){
        logger.info( "Successfully return result from OpenAI." )

        const requiredContent = response.data['choices'][0]['message']['content']

        const courseOutlineList = resolveCourseOutlineFromOpenAI(requiredContent)

        return courseOutlineList;
        
    }else{
        logger.error( `Error when OpenAI call to ${url}: ${response.data }`)
        throw new Error( `Error during API call: ${response.status}`  )
    }
    
}

const resolveCourseOutlineFromOpenAI = (openAiReturn: String)=>{
    //find main topic **[A~Z] first 
    //from that, split them to detailed topic by key subtopic.
    logger.info("Resolving course list return from openAI.")
    const lines = openAiReturn.split('\n');
    const outline = {};
    let currentTopic;
    
    const mainTopicStartWithStr = 'maintopic.'
    const subTopicStartWithStr = 'subtopic.'

    for (let line of lines) {
      if (line.trim().includes(mainTopicStartWithStr)) {
        const dotList = line.trim().split(".");
        const key = dotList[1].split(":")[0];
        const topic = dotList[1].split(":")[1]
  
        outline[key] = {
          topic: topic,
          details: []
        };
  
        currentTopic = key;
        logger.info( `currentTopic: ${currentTopic}` )
      } else if (line.trim().includes(subTopicStartWithStr)) {
        const dotList = line.trim().split(".");

        const secondList = dotList[2].split(":")

        const subtopicKey = `${dotList[1]}.${secondList[0]}`
        const subtopicDetail = secondList[1]
        

        logger.info( `currentTopic: ${currentTopic}, subtopicKey: ${subtopicKey}, subtopicDetail: ${subtopicDetail} ` )
        outline[currentTopic].details.push({
          [subtopicKey]: subtopicDetail
        });
      }
    }
  
    return outline;
}

const resolveUserBackGround = (userBackground: any) =>{
  let EducationBackground = userBackground.EducationBackground
  const EducationBackgroundOther = userBackground.EducationBackgroundOther

  EducationBackground = EducationBackgroundOther == undefined?EducationBackground:EducationBackgroundOther;

  const WorkExperience = userBackground.WorkExperience
  const WorkIndustry = userBackground.WorkIndustry

  const preFerredTeachingStyle  = userBackground.TeachingStyle

  const Interest = userBackground.Interest
  const Remarks = userBackground.Remarks

  const prompt = `        
    User Background:
    1. Education Background: ${EducationBackground}
    2. Work Experience : ${WorkExperience}
    3. Work Industry : ${WorkIndustry}
    4. PreFerred TeachingStyle: ${preFerredTeachingStyle}
    5. Interest : ${Interest}
    6. Remarks: ${Remarks}`

  return prompt;
}

const resolvedCourseOutline = (courseOutlineObj: any) =>{

  const courseName = courseOutlineObj.courseName;
  const courseOutline = JSON.stringify(courseOutlineObj.courseOutline);
  const prompt = `
    This is the course outline of ${courseName} customized of this user in json format:
    ${courseOutline}

    You can see to keys are the main topic and the value of [key].topic are the name of topic.
    Each topic contains an array list called details, are the sub-topic with names.
  `
  return prompt;
}

const resolveChatRecord = ( chatRecordObj: any) =>{
  const chatRecord = chatRecordObj.toString();
  const prompt = `
  Here's the conversation record between you and user of this topic in json format, which are ordered by timestamp in ascending order:
  ${chatRecord}

  For each object inside this list. There are three keys need to consider:
    1. 'Role' . If the value = 'system' , then it is the answer you gave user.
        if the value = 'user' , then it is the question user ask.
    2. 'Message'. The message that the mentioned role typed. 
  `
  return prompt;
}

const getPrompt_courseOutline = ( userBackground: any , TopicName: string, LastGeneratedCourseOutline: any, UserComment: string ) =>{
    const resolvedUserBackground = resolveUserBackGround(userBackground);
    let prompt = `
        You are a blockchain and Web3 expert and you needs to provide a customized course outline of blockchain and Web3 knowledge based on user background and must talk about ${TopicName}. In general, if the user has a more technical background, you teach the user in deeper way.

        ${resolvedUserBackground}

        *******************************************************
        1. Please provide a structured result in point form. The strucutre must be divied in two levels. 
        Level 1 is the blockchain/ web3 topic with starting label maintopic.[A~Z] 
        Level 2 is the detail of each topic about with starting label with format subtopic.[lable of the topic].[integer with acending order]. 

        2. Please ensure the content of the course outline must talk about : ${TopicName}.
        3. Please ensure the response format is 100% fully stake with my instruction for you in above.
        4. For Example, if the course outline must talk about liquidity pool, you should not generate topic / sub-topic about introduction of blockchain.
        5. If user is not required to learn blockchain 101, you must not generate topic shown below:
          A: Introduction to Blockchain and Web3
          B: Future of Blockchain and Web3
          C: Regulatory and Ethical Considerations
    `;
    if ( LastGeneratedCourseOutline != undefined ){
      UserComment = UserComment== undefined ? "N/A" : UserComment

      logger.info("Add LastGeneratedCourseOutline to the prompt for course outline generation.")
      LastGeneratedCourseOutline = JSON.stringify(LastGeneratedCourseOutline);

      prompt += `
      6. Note that user was requested course outline last time and the user doesn't feel it's suitable for him/her with comment : ${UserComment}. Please don't generate the same course line as below:

      ${LastGeneratedCourseOutline}
      *********************************************
      `
    }

    return prompt;
} 

const getPrompt_anserUserQuestion = ( 
  userBackground: any, 
  courseOutline: any ,
  chatRecordMongo: any,
  subtopicName : string,
  topicId : string,
  message: string 
) =>{
  const userBackgroundStr = resolveUserBackGround(userBackground);
  const courseOutlineStr =  resolvedCourseOutline(courseOutline);
  const chatRecord = resolveChatRecord(chatRecordMongo);
  const courseName =courseOutline.courseName
  const topicName = courseOutline.courseOutline[topicId]['topic']
  const prompt = `
    User is asking a question: ${message}
    You are a blockchain and Web3 expert and you needs to teach the user about the question of this course. The answer should customized for the user based on:
      1. Course detail  
      2. user background
      3. Customized course outline for this user
      4. Chat record between you and the user about the topic of this course in json format.
    
    In general, if the user has a more technical background, you teach the user in deeper way.
    
    *******************************************************
    Here's the course details user asking for. Your should teacher what user asking for limited to this course details.
    1. Course Name: ${courseName}
    2. Learning topic: ${subtopicName} of topic :  ${topicName}

    *******************************************************
    ${userBackgroundStr}
    *******************************************************
    ${courseOutlineStr}
    *******************************************************
    ${chatRecord}
    *******************************************************
    For the answer output, you should follow instructions below:

    1. Please teach and answer user question of this topic. 
      If user is saying something like let's sart the course, please tell him/her some knowledge about the course details mentioned.
    2. Only need to answer Learning topic: ${subtopicName} of topic :  ${topicName} of the course  ${courseName} , and don't teach all the knowledge inside the course outline. 
    3. Don't generate the course line.
    4. Please answer the question in a under 600 words.

    ************************************************************
    Please ensure the response is 100% fully stake with my instruction for you in above.
  `

  return prompt;
}

const answerQuestionByOpenAI = async( prompt , message ) => {
  logger.info("Start openAi to answer user question.")
  const apiKey = process.env.OPENAI_API_KEY
  const url = `${OPENAI_API_BASE_URL}/v1/chat/completions`

  logger.info("Generating prompt.")
  const data = {
      'model': 'gpt-4o',
      'messages': [
          {"role": "system", "content": prompt },
          {"role": "user", "content":  message }
      ],
      'max_tokens': 1000,
      'temperature': 0.5 
  }

  const headers = {'Authorization': `Bearer ${apiKey}`}
    
  logger.info("Request openAi analysis.")
  const response:AxiosResponse  = await axios.post(url,data, {headers} );
  if ( response.status == 200 ){
      logger.info( "Successfully return result from OpenAI." )

      const requiredContent = response.data['choices'][0]['message']['content']
      return requiredContent;
      
  }else{
      logger.error( `Error when OpenAI call to ${url}: ${response.data }`)
      throw new Error( `Error during API call: ${response.status}`  )
  }
}

/**
 * Call openai(gemma2b) via theta cloud node
 * @param prompt 
 * @returns 
 */
const answerQuestionByGemma2B  = async( prompt, message)=>{
  const openai_api_key = process.env.OPENAI_API_KEY
  //const openai_api_base = "https://gemma2b5pma21k6t3-627da26020e70205.tec-s1.onthetaedgecloud.com/v1"
  const openai_api_base = "https://gemma2b5pma21k6t3-627da26020e70205.tec-s1.onthetaedgecloud.com/v1/chat/completions"
  
  const openai = new OpenAI({
    apiKey:openai_api_key,
    baseURL:openai_api_base,
  });
  logger.info("Generating answers by theta cloud gemma2b.")
  const data = {
    model: "google/gemma-2b",
    messages: [
      {"role": "system", "content": "I am a blockchain and Web3 expert" },
      {"role": "user", "content":  prompt }
    ],
    'max_tokens': 1000,
    'temperature': 0.5 
  }

  const headers = {'Authorization': `Bearer ${openai_api_key}`}
    
  logger.info("Request theta cloud llm( google/gemma-2b ) analysis.")
  const response:AxiosResponse  = await axios.post(openai_api_base,data, {headers} );
  if ( response.status == 200 ){
      logger.info( "Successfully return result from OpenAI." )

      const requiredContent = response.data['choices'][0]['message']['content']
      return requiredContent;
      
  }else{
      logger.error( `Error when OpenAI call to ${openai_api_base}: ${response.data }`)
      throw new Error( `Error during API call: ${response.status}`  )
  }
  /*

  const completion = await openai.chat.completions.create({
      model: "google/gemma-2b",
      messages: [
        {"role": "system", "content": "I am a blockchain and Web3 expert" },
        {"role": "user", "content":  prompt }
      ],
      'max_tokens': 1000,
      'temperature': 0.5 
  });
  
  logger.info("Request gemma2b analysis.")
  return completion['choices'][0]['message']['content']
  */
}

const answerUserQuestion = async ( 
  userBackground: any, 
  courseOutline: any ,
  chatRecordMongo: any,
  subtopicName : string,
  topicId : string,
  message: string ,
  llmModelRequested: string
) =>{
  const prompt = getPrompt_anserUserQuestion(
    userBackground,
    courseOutline,
    chatRecordMongo,
    subtopicName,
    topicId,
    message
  );
  if ( llmModelRequested == llmModel.openAI ){
    return await answerQuestionByOpenAI(prompt, message);
  }else if ( llmModelRequested == llmModel.gemma2b ) {
    return await answerQuestionByGemma2B(prompt, message);
  }


}

const getPromptOfQuizGeneration = (
  chatRecordMongo,
  courseName,
  topicName,
  SubTopicName
)=>{
  const chatRecord = resolveChatRecord(chatRecordMongo);
  const prompt = `
    You are a blockchain and Web3 expert and you needs generate a multiple choise quiz. The answer should customized for the user based on the chat Record which are the questions asked from user and the answer you responsed before .
    ***************************************

    Limitation of the quiz :
    1. All questions are multiple choice
    2. The question should be customized for this user based on the chat record I mentioned.
    3. All question should only ask about course ${courseName} , limted to ${topicName}: ${SubTopicName}
    4. Needs ten questions only
    5. Each question should have only 4 choices
    6. Only one choise is the correct answer
    7. Format of the return:
    7a. array list of object.
    7b. each object shoudl includes these keys : 
      7.b.1. question
      7.b.2. choices 
      7.b.3. answer that is the alphabet of the correct choice
    8. Example of one of the object:
      { 
        question: "What is the consensus mechanism of Bitcoin?"
        choices: [
          'A': 'Proof of Work(PoW)',
          'B': 'Proof of Stack(PoS)',
          'C': 'Proof of storage',
          'D': ' Delegated Proof-of-Stake (DPoS)'
        ],
        answer: 'A'
      } 

    ************************************************
    Please ensure the response format is 100% fully stake with my instruction for you in above.

  `;

  return prompt;
}

const resolveJsonFmOpenAi = (openAiQuizStr)=>{
  const jsonStartIndex = openAiQuizStr.indexOf('[');
  const jsonEndIndex = openAiQuizStr.lastIndexOf(']') + 1;
  const trimmedJsonString = openAiQuizStr.substring(jsonStartIndex, jsonEndIndex);
  // Parse the string as JSON
  const jsonObject = JSON.parse(trimmedJsonString);

  return jsonObject;
}

const generateQuizOpenAi = async(
  chatRecordMongo,
  courseName,
  topicName,
  SubTopicName
)=>{
  const prompt = getPromptOfQuizGeneration(
    chatRecordMongo,
    courseName,
    topicName,
    SubTopicName
  );
  logger.info("Start openAi quiz  generation.")
  const apiKey = process.env.OPENAI_API_KEY
  const url = `${OPENAI_API_BASE_URL}/v1/chat/completions`

  logger.info("Generating prompt.");

  let messages = [];

  chatRecordMongo.forEach(element => {
    const obj = { "role": element.Role ,  "content": element.Message }
    messages.push(obj);
  });

  messages.push({"role": "user", "content": prompt })

  const data = {
      'model': 'gpt-4o',
      'messages': messages,
      'max_tokens': 1000,
      'temperature': 0.5 
  }

  const headers = {'Authorization': `Bearer ${apiKey}`}
  
  logger.info("Request openAi analysis.")
  const response:AxiosResponse  = await axios.post(url,data, {headers} );
  if ( response.status == 200 ){
      logger.info( "Successfully return result from OpenAI." )

      const requiredContent = response.data['choices'][0]['message']['content']

      return resolveJsonFmOpenAi(requiredContent);
      
  }else{
      logger.error( `Error when OpenAI call to ${url}: ${response.data }`)
      throw new Error( `Error during API call: ${response.status}`  )
  }
  

} ;


const prompt_getQuizExplain = (quizAnswerList)=>{

  const prompt = `
  You are a blockchain and Web3 expert and you review the user submitted quiz list and explain why it is correct if needed.

  ************************************
  Here's the user submitted quiz list submitted by user:
  ${ JSON.stringify(quizAnswerList) }

  ************************************
  Here are serveral things you must consider:
  1. the user submitted quiz list is an array list of json.
  2. Each json contains serval data with key
    2a. question: The question asked
    2b. choices : multiple choices to choose which is an array list of object with key = choice number, value = string of the option
    2c: answer: The correct answer
    2d: userAnswer: What user answered
    2e. isCorrect: Whether the user correct
  3. For each question, you should response following things:
    3a. Why the answer is correct if it is not a pure fact
    3b. Possibility of misunderstanding if isCorrect = false 
  4. The explanation at point 3 should under 100 words.
  5. You should return the reslt as json with objects that:
    5.1: each object represents 1 question.  
    5.2: each object contains key = "questionNo" , values = question number
    5.3: each object contains key = "question" , values = The actual question
    5.4: each object contains key = "userAnswer" ,  values = what use choosed
    5.5: each object contains key = "isCorrect" ,  values = Does user correct , either true or false
    5.6: each object contains key = "explanation" , values = the explanation of the question
    5.7: example of an object: { questionNo : 1 , question:  "What is the primary purpose of Bitcoin?" , userAnswer:"B", isCorrect: true,  explanation: "The correct answer is C: Digital currency.\n Bitcoin was designed as a decentralized digital currency for secure, peer-to-peer transactions."  } 
  

  ************************************************
  Please ensure the response format is 100% fully stake with my instruction for you in above.

  `

  return prompt;
}

const getQuizExplainFromOpenAI = async( quizAnswerList )=>{
  //prompt
  const prompt = prompt_getQuizExplain(quizAnswerList);

  logger.info("Start openAi quiz explanation generation.")
  const apiKey = process.env.OPENAI_API_KEY
  const url = `${OPENAI_API_BASE_URL}/v1/chat/completions`

  logger.info("Generating prompt.");

  let messages = [];

  messages.push({"role": "system", "content":"I'm a blockchain and web3 expert."})
  messages.push({"role": "user", "content": prompt })

  const data = {
      'model': 'gpt-4o',
      'messages': messages,
      'max_tokens': 1000,
      'temperature': 0.5 
  }

  const headers = {'Authorization': `Bearer ${apiKey}`}
  
  logger.info("Request openAi analysis.")
  const response:AxiosResponse  = await axios.post(url,data, {headers} );
  if ( response.status == 200 ){
      logger.info( "Successfully return result from OpenAI." )

      const requiredContent = response.data['choices'][0]['message']['content']

      return resolveJsonFmOpenAi(requiredContent);
      
  }else{
      logger.error( `Error when OpenAI call to ${url}: ${response.data }`)
      throw new Error( `Error during API call: ${response.status}`  )
  }
}


const getReqbodyImgByStableDiffusion4 = (prompt)=>{
  return   {
    "prompt":  prompt ,
    "negative_prompt": "",
    "seed": -1,
    "steps":20
  }
}

const genImgByStableDiffusion4 = async( prompt )=>{
  const url = 'https://stablediffvfejdi9tm0-48826832508b9a68.tec-s1.onthetaedgecloud.com/sdapi/v1/txt2img';
  const requestBody = getReqbodyImgByStableDiffusion4(prompt);
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json'
  }
  const response:AxiosResponse  = await axios.post(url,requestBody, {headers} );
  if ( response.status == 200 ){
    logger.info( "Successfully return result from theta cloud : stabe diffusion 4." )
    return response.data;
    
  }else{
      logger.error( `Error when calling theta cloud : stabe diffusion 4  via  ${url}: ${response.data }`)
      throw new Error( `Error during API call: ${response.status}`  )
  }

}



export {
    genCourseOutlineByOpenAI,
    resolveCourseOutlineFromOpenAI,
    answerUserQuestion,
    generateQuizOpenAi,
    getQuizExplainFromOpenAI,
    genImgByStableDiffusion4
}