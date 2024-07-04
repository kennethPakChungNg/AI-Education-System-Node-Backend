import axios,{AxiosResponse } from 'axios';
import {logger} from '../common'

const OPENAI_API_BASE_URL = 'https://api.openai.com'


const genCourseOutlineByOpenAI = async( userBackground: any)=>{
    logger.info("Start openAi course outline generation.")
    const apiKey = process.env.OPENAI_API_KEY
    const url = `${OPENAI_API_BASE_URL}/v1/chat/completions`

    logger.info("Generating prompt.")
    const data = {
        'model': 'gpt-4-0125-preview',
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

const getPrompt_courseOutline = ( userBackground: any ) =>{
    let EducationBackground = userBackground.EducationBackground
    const EducationBackgroundOther = userBackground.EducationBackgroundOther

    EducationBackground = EducationBackgroundOther == undefined?EducationBackground:EducationBackgroundOther;

    const WorkExperience = userBackground.WorkExperience
    const WorkIndustry = userBackground.WorkIndustry

    const preFerredTeachingStyle  = userBackground.TeachingStyle

    const Interest = userBackground.Interest
    const Remarks = userBackground.Remarks

    const prompt = `
        You are a blockchain and Web3 expert and you needs to provide a customized course outline of blockchain and Web3 knowledge based on user background. In general, if the user has a more technical background, you teach the user in deeper way.

        User Background:
        1. Education Background: ${EducationBackground}
        2. Work Experience : ${WorkExperience}
        3. Work Industry : ${WorkIndustry}
        4. PreFerred TeachingStyle: ${preFerredTeachingStyle}
        5. Interest : ${Interest}
        6. Remarks: ${Remarks}

        *******************************************************
        Please provide a structured result in point form. The strucutre must be divied in two levels. 
        Level 1 is the blockchain/ web3 topic with starting label maintopic.[A~Z] 
        Level 2 is the detail of each topic with starting label with format subtopic.[lable of the topic].[integer with acending order]. 

        Please ensure the response format is 100% fully stake with my instruction for you in above.
    
    `;

    return prompt;
} 

export {
    genCourseOutlineByOpenAI,
    resolveCourseOutlineFromOpenAI,

  
}