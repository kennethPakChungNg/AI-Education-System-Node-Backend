import * as express from 'express'
const router = express.Router();
import {
    logger
} from '../common'
import httpStatus from 'http-status'
import { jsonResponse } from '../common/responseUtil';
import { 
    saveUserBackground,
    queryUserBackground
} from './userOperationController';
/**
 * TODO
 * 
 * #1 save info 
 * #2 update info ?
*/

router.post( '/storeUserBackground' , async(req: express.Request,res: express.Response)=>{   
    try{
        const input = req.body;

		//save user uid, email, request details to mongodb
		const data = {
			WalletAddress: input.WalletAddress,
			name: input.name,
			educationLevel: input.educationLevel,
			educationBackground: input.educationBackground,
			subject: input.subject, // For university/college major
			WorkIndustry: input.workingIndustry,
			WorkExperience: input.workingExperience,
			TeachingStyle: input.teachingStyle,
			LearningStyle: input.learningStyle,
			LearningMaterialTextPercent: input.LearningMaterialTextPercent,
			LearningMaterialImagePercent: input.LearningMaterialImagePercent,
			LearningMaterialVideoPercent: input.LearningMaterialVideoPercent,
			Interest: input.interests, // Note the plural form from the frontend
			Remarks: input.remarks
		};
		
		console.log('Processed data:', data);

        const returnResult = await saveUserBackground(data)

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

router.post( '/queryUserBackgroundByAddress' , async(req: express.Request,res: express.Response)=>{   
    try{
        const input = req.body;
        const walletAddr = input.WalletAddress;
		//save user uid, email, request details to mongodb
		const filter = {
            WalletAddress: walletAddr
		}

        const returnData = await queryUserBackground(filter)

		return jsonResponse(
			res,
			{ status: httpStatus.OK, data: returnData }
		)
    }catch(error){
        logger.error( error.stack )
		return jsonResponse(
			res,
			{ status: httpStatus.BAD_REQUEST, error: error.message }
		)
    }
});

export default router;