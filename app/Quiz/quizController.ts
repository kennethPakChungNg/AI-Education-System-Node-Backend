
import { Quiz } from "./model/Quiz";
import {QuizResult} from './model/QuizResult'
const { v4: uuidv4 } = require('uuid');
import { logger } from "../common";
//retake quiz base on 

//gen quiz at the first time, with what user learned
const saveQuizToDb = async(data)=>{
    try{
        const returnFromDb = await Quiz.create(data);
        return returnFromDb;
      }catch(error){
        if (error.code === 11000){
          throw new Error(`Duplicate education conversation data detected. Emitted by user ${data['WalletAddress']} `)
        }else{
          throw error;
        }
      }
}

const queryQuiz = async(filter={}, selectColumn='')=>{
	try {
    let returnFromDb = null;
    if ( selectColumn == '' ){
      returnFromDb = await Quiz
        .find(filter)
    }else{
      returnFromDb = await Quiz
      .find(filter)
      .select(selectColumn)
      ;
    }

    return returnFromDb;
	}catch (error) {
		throw new error(`Error from queryQuiz: ${error.stack}`)
  }
}

const queryQuizResult = async(filter={}, selectColumn= '')=>{
  try {
    let returnFromDb = null;
    if ( selectColumn == '' ){
        returnFromDb = await QuizResult.find(filter);
    }else{
        returnFromDb = await QuizResult
            .find(filter)
            .select(selectColumn);
    }

    return returnFromDb;
  }catch (error) {
    throw new error(`Error from queryCourseOutline: ${error.stack}`)
  }
}

const storeQuizResult = async(             
  WalletAddress ,
  quizId,
  CourseId,
  TopicId,
  SubTopicId,
  returnResult ,
  SubmissionId
)=>{
  try{
    logger.info(`Start to store Quiz Result from walletAddress ${WalletAddress} `)
    if (SubmissionId == undefined){
      SubmissionId = uuidv4();
    }

    const searchQuizResult = {
      "WalletAddress": WalletAddress,
      "SubmissionId": SubmissionId
    };
    
    const quizResult = await queryQuizResult(searchQuizResult);

    const data = {
      WalletAddress: WalletAddress,
      QuizId : quizId,
      CourseId: CourseId,
      TopicId: TopicId,
      SubTopicId: SubTopicId,
      QuizResult: returnResult,
      SubmissionId : SubmissionId
    }

    let returnFromDb;
    if (quizResult.length > 0) {
        returnFromDb = await QuizResult.findOneAndUpdate(
          searchQuizResult,
            { $set: data },
            { new: true, omitUndefined: true }
          );
    }else{
        returnFromDb = await QuizResult.create(data);
    }
 
    logger.info("Quiz Result stored.")
    return returnFromDb;
  }catch(error){
    if (error.code === 11000){
      throw new Error(`Duplicate education conversation data detected. Emitted by user ${WalletAddress} `)
    }else{
      throw error;
    }
  }
}


const countResult = async(data)=>{

}

export {
    saveQuizToDb,
    queryQuiz,
    storeQuizResult
}