import * as express from 'express'
const router = express.Router();
import {
    logger
} from '../common'
import httpStatus from 'http-status'
import { jsonResponse } from '../common/responseUtil';
import {
    genCourseOutlineByOpenAI
} from './contentGenerateController'

import {
    queryUserBackground
} from '../userOperations/userOperationController'
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
 * Step 6: 
 */
router.post( '/genStudyPlan' , async(req: express.Request,res: express.Response)=>{   

});

export default router;