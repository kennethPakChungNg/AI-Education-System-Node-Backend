import * as express from 'express'
const router = express.Router();
import {
    logger
} from '../common'
import httpStatus from 'http-status'
import { jsonResponse } from '../common/responseUtil';

import {createHash} from 'crypto';
import { 
    queryConversationSchema,
    saveConversationSchema 
} from './conversationApiSchema';
import validateSchema from '../common/validateSchema';
import { 
    saveEducateConversation,
    queryEducateConversation 
} from './conversationController';

import moment from 'moment';
/*
Query on specific subtopic 
*/
router.post( '/queryEduConversation' , queryConversationSchema,validateSchema(),async(req: express.Request,res: express.Response)=>{   
    try{
        const filter = {
            WalletAddress: req.body.WalletAddress,
            CourseId : req.body.CourseId,
            TopicId: req.body.TopicId,
            SubTopicId: req.body.SubTopicId
        }

        const result = await queryEducateConversation(filter);

		return jsonResponse(
			res,
			{ status: httpStatus.OK, data: result }
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
 * Step 6: 
 */
router.post( '/saveSingleEduConversation' , saveConversationSchema, validateSchema(), async(req: express.Request,res: express.Response)=>{   
    try{
        const role = req.body.Role
        const walletAddress = req.body.WalletAddress
        const message = req.body.Message
        const courseId =req.body.CourseId
        const topicId = req.body.TopicId
        const subTopicId = req.body.SubTopicId
        const conversationTime = req.body.ConversationTimestamp

        const hashedMsg = createHash('sha256').update(message).digest('hex');
        const insertData = {
            'Role':role,
            'WalletAddress':walletAddress,
            'Message': message,
            'HashedMsg':hashedMsg,
            'CourseId':courseId,
            'TopicId': topicId,
            'SubTopicId':subTopicId,
            'ConversationTimestamp': conversationTime,
            'ConversationDateTime': moment.unix(conversationTime)
        }

        const result = await saveEducateConversation(insertData);
        return jsonResponse(
			res,
			{ status: httpStatus.OK, data: result }
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