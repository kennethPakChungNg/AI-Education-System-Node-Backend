import * as express from 'express'
const router = express.Router();
import {
    logger
} from '../common'
import httpStatus from 'http-status'
import { jsonResponse } from '../common/responseUtil';
import {
    genCourseOutlineByOpenAI,
    answerUserQuestion
} from './contentGenerateController'

import {
    queryUserBackground
} from '../userOperations/userOperationController'

import validateSchema from '../common/validateSchema';
import { answerUserQuestionSchema  } from './contenGenerateApiSchema';
import { queryCourseOutline } from '../CourseOutline/courseOutlineController';
import { queryEducateConversation } from '../Conversation/conversationController';
/**
 * TODO
 * 
 * #1 save info 
 * #2 generate specific areas / options / topic to user.
 * #3 generate course outline based on user's background

*/


router.post( '/genCourseOutline' , async(req: express.Request,res: express.Response)=>{   
    try{
        const WalletAddress = req.body.WalletAddress
        if ( WalletAddress == undefined ){
            //return error
            const errorMsg = "Must provide walletAddress."
            throw new Error(errorMsg)
        }
        //get user background from db
        const userBackground = await queryUserBackground( {
            WalletAddress: WalletAddress
        });

        // return error if it is null
        if (userBackground == undefined || userBackground ==  null ){
            //return error
            const errorMsg = "Must provide user background."
            throw new Error(errorMsg)
        }

        // call chatgpt 
        const courseOutline = await genCourseOutlineByOpenAI(userBackground[0] );
		return jsonResponse(
			res,
			{ status: httpStatus.OK, data: courseOutline }
		)
    }catch(error){
        logger.error( error.stack )
        return jsonResponse(
            res,
            { status: httpStatus.INTERNAL_SERVER_ERROR, error: error.message }
        )
    }
});


/**
 * 
 * Generate answer by openai, including all history conversation  
 */
router.post('/answerUserQuestion' , answerUserQuestionSchema ,validateSchema(), async(req: express.Request,res: express.Response)=>{   
    try{
        const WalletAddress = req.body.WalletAddress
        //find user profile
        const userBackground = await queryUserBackground( {
            WalletAddress: WalletAddress
        });

        const CourseId = req.body.CourseId
        //find the course outline from wallet addr + courseId
        const courseOutline = await queryCourseOutline({
            WalletAddress: WalletAddress,
            courseId: CourseId
        });

        const message = req.body.Message
        const topicId = req.body.TopicId
        /* 
        retrieve prompt based on what user passed in.
        if subtopic id is null, the user is triggered by start to learn first time, set subtopic id = 1.1
        otherwise , the user is asking question about a sub topic.
        retrieve the chat record from database
        */
        let SubTopicId = req.body.SubTopicId;
        const detailsOfTopic = Object.assign({} , ...(courseOutline[0].courseOutline[topicId].details) );
        if ( SubTopicId == undefined ){
            SubTopicId = Object.keys( detailsOfTopic )[0]
        }
        let subtopicName = detailsOfTopic[SubTopicId]

        const chatRecord = await queryEducateConversation({
            WalletAddress: WalletAddress,
            CourseId: CourseId,
            TopicId: topicId,
            SubTopicId: SubTopicId
        }, 'Role Message ConversationTimestamp' )


        //ask openai using the prompt and retrieve result.
        const answerFromOpenAi = await answerUserQuestion(
            userBackground[0],
            courseOutline[0],
            chatRecord,
            subtopicName,
            topicId,
            message
        )

        //formatting the content and return result
        return jsonResponse(
			res,
			{ status: httpStatus.OK, data: answerFromOpenAi }
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