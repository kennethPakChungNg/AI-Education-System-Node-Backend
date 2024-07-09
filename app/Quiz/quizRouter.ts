import * as express from 'express'
const router = express.Router();
import { jsonResponse } from '../common/responseUtil';
import {
    logger
} from '../common'
import httpStatus from 'http-status'
import validateSchema from '../common/validateSchema';
import { calQuizResultSchema } from './quizApiSchema';
import { 
    queryQuiz ,
    storeQuizResult
} from './quizController';
import { getQuizExplainFromOpenAI } from '../ContentGenerate/contentGenerateController';

router.post("/calQuizResult", calQuizResultSchema,  validateSchema(),async(req: express.Request,res: express.Response)=>{   
    try{
        const WalletAddress = req.body.WalletAddress
        const SubmittedAnswer = req.body.SubmittedAnswer
        const quizId =  req.body.QuizId
        const CourseId = req.body.CourseId
        const TopicId = req.body.TopicId
        const SubTopicId = req.body.SubTopicId
        const SubmissionId = req.body.SubmissionId
        //find quiz answer
        let quizAnswerList = await queryQuiz( {
            WalletAddress: WalletAddress, 
            QuizId: quizId,
            CourseId: CourseId ,
            TopicId: TopicId,
            SubTopicId: SubTopicId
        });

        if( quizAnswerList == undefined || quizAnswerList.length == 0 ){
            throw new Error(`Cannot find quiz with id ${quizId}`)
        }

        //find if the user answered are correct or not.
        quizAnswerList = quizAnswerList[0].Quiz
        const totalQuestions = quizAnswerList.length

        let correctCount = 0;
        quizAnswerList.forEach( (item, index)=>{
            const correctAnswer = item.answer.trim()
            const userAnswer = SubmittedAnswer[index].answer.trim()
            
            let isCorrect = false;
            if ( correctAnswer == userAnswer){
                isCorrect = true;
                correctCount ++;
            }
            item.isCorrect = isCorrect;
            item.userAnswer = userAnswer;
            //const newObj = { ...item, 'isCorrect': isCorrect, 'userAnswer': userAnswer};
            //return newObj;
        })

        const CorrectPercentage = (correctCount/totalQuestions)*100
        //pass the quizAnswerList the openAi for explaination.
        const questionExplanation = await getQuizExplainFromOpenAI(quizAnswerList);
        //return result
        const returnResult = {
            "explanation": questionExplanation,
            'totalQuestions': totalQuestions,
            'correctCount': correctCount,
            'CorrectPercentage': CorrectPercentage
        }

        await storeQuizResult( 
            WalletAddress ,
            quizId,
            CourseId,
            TopicId,
            SubTopicId,
            returnResult,
            SubmissionId
        )

        return jsonResponse(
			res,
			{ status: httpStatus.OK, data: returnResult }
		)
    }catch(error){
        logger.error( error.stack )
        return jsonResponse(
            res,
            { status: httpStatus.INTERNAL_SERVER_ERROR, error: error.message }
        )
    }
});
export default router;