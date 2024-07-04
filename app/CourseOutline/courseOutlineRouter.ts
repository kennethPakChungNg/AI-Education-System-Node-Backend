import * as express from 'express'
const router = express.Router();
import {
    logger
} from '../common'
import httpStatus from 'http-status'
import { jsonResponse } from '../common/responseUtil';

import {
    saveCourseOutline,
    queryCourseOutline
} from './courseOutlineController'
const { v4: uuidv4 } = require('uuid');
/**
 * Step 6: 
 */
router.post( '/saveCourseOutline' , async(req: express.Request,res: express.Response)=>{   
    try{
        const courseOutline = req.body.courseOutline
        const walletAddress = req.body.WalletAddress
        const courseName = req.body.courseName

        const data ={
            "WalletAddress":walletAddress,
            "courseName": courseName,
            "courseOutline": courseOutline,
            "courseId":uuidv4()
        }

        const result = await saveCourseOutline(data);
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


router.post('/queryCourseOutline' , async(req: express.Request,res: express.Response)=>{   
    try{
        const input = req.body;
        const walletAddr = input.WalletAddress;
        const courseId = input.courseId
		//save user uid, email, request details to mongodb
		const filter = {
            WalletAddress: walletAddr,
            courseId : courseId
		}

        const returnData = await queryCourseOutline(filter)

		return jsonResponse(
			res,
			{ status: httpStatus.OK, data: returnData }
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