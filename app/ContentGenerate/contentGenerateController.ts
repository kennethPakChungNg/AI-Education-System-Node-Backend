import axios,{AxiosResponse } from 'axios';
import {logger} from '../common'

const OPENAI_API_BASE_URL = 'https://api.openai.com'


const genCourseOutlineByOpenAI = async( userBackground: any)=>{
    logger.info("Start openAi course outline generation.")
    const apiKey = process.env.OPENAI_API_KEY
    const url = `${OPENAI_API_BASE_URL}/v1/chat/completions`

    logger.info("Generating prompt.")
    const data = {
        'model': 'gpt-4o',
        'messages': [
            {"role": "system", "content": getPrompt_courseOutline(userBackground)},
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

const getPrompt_courseOutline = ( userBackground: any ) =>{
    const resolvedUserBackground = resolveUserBackGround(userBackground);
    const prompt = `
        You are a blockchain and Web3 expert and you needs to provide a customized course outline of blockchain and Web3 knowledge based on user background. In general, if the user has a more technical background, you teach the user in deeper way.

        ${resolvedUserBackground}

        *******************************************************
        Please provide a structured result in point form. The strucutre must be divied in two levels. 
        Level 1 is the blockchain/ web3 topic with starting label maintopic.[A~Z] 
        Level 2 is the detail of each topic with starting label with format subtopic.[lable of the topic].[integer with acending order]. 

        Please ensure the response format is 100% fully stake with my instruction for you in above.
    `;

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


  `

  return prompt;
}

const answerUserQuestion = async ( 
  userBackground: any, 
  courseOutline: any ,
  chatRecordMongo: any,
  subtopicName : string,
  topicId : string,
  message: string 
) =>{
  const prompt = getPrompt_anserUserQuestion(
    userBackground,
    courseOutline,
    chatRecordMongo,
    subtopicName,
    topicId,
    message
  );

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

export {
    genCourseOutlineByOpenAI,
    resolveCourseOutlineFromOpenAI,
    answerUserQuestion
  
}