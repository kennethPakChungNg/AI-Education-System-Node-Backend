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
} from './courseOutlineController';

import { 
    SuggestedCourseOutline 
} from './models/SuggestedCourseOutline';

import { 
    updateLearningStatus ,
    updateCourseName 
} from './courseOutlineApiSchema';
import validateSchema from '../common/validateSchema';
import { CourseOutline } from './models/CourseOutline';



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
        let requiredField = input.requiredField
		//save user uid, email, request details to mongodb
		let filter = {
            WalletAddress: walletAddr
		}

        if (courseId != undefined){
            filter['courseId'] = courseId
        }

        if ( requiredField == undefined){
            requiredField = ''
        }else{
            requiredField = requiredField.join(' ');
        }

        const returnData = await queryCourseOutline(filter,requiredField )

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

router.post("/updateCourseName", updateCourseName , validateSchema(), async(req: express.Request, res: express.Response) => {
    try {
            const filter = {
                WalletAddress: req.body.WalletAddress,
                courseId:req.body.CourseId,
            }

            const course = await CourseOutline.findOne(
                filter
            );

            course.courseName = req.body.CourseName ; 

            course.markModified('courseName');
            const saveResult =  await course.save();
            return jsonResponse(
                res,
                { status: httpStatus.OK, data: saveResult }
            );
    } catch (error) {
        logger.error(error.stack);
        return jsonResponse(
        res,
        { status: httpStatus.INTERNAL_SERVER_ERROR, error: error.message }
        );
    }
})


router.post("/updateLearningStatus", updateLearningStatus, validateSchema(), async(req: express.Request, res: express.Response) => {
    try {
            const filter = {
                WalletAddress: req.body.WalletAddress,
                courseId:req.body.CourseId,
            }
            const TopicId = req.body.TopicId;
            const SubTopicId = req.body.SubTopicId;
            const isCompleted = req.body.isCompleted ;
            const course = await CourseOutline.findOne(filter);
            if ( course == undefined || course == null){
                return jsonResponse(
                    res,
                    { status: httpStatus.OK, data: {
                        "message":"course not find!"
                    } }
                );
            }
            const topicDetails = course.courseOutline[TopicId].details
            topicDetails.map(subTopic=>{
                const keyList = Object.keys(subTopic)
                if( keyList.includes(SubTopicId) ){
                    subTopic['isCompleted'] =isCompleted;
                }
                return subTopic;
            })

            course.markModified('courseOutline');
            const saveResult =  await course.save();
            return jsonResponse(
                res,
                { status: httpStatus.OK, data: saveResult }
            );
    } catch (error) {
        logger.error(error.stack);
        return jsonResponse(
        res,
        { status: httpStatus.INTERNAL_SERVER_ERROR, error: error.message }
        );
    }
})

router.get('/suggestedCourseOutlines', async (req: express.Request, res: express.Response) => {
    try {
      const suggestedCourseOutlines = await SuggestedCourseOutline.find({}, { _id: 0, __v: 0 });
      return jsonResponse(
        res,
        { status: httpStatus.OK, data: suggestedCourseOutlines }
      );
    } catch (error) {
      logger.error(error.stack);
      return jsonResponse(
        res,
        { status: httpStatus.INTERNAL_SERVER_ERROR, error: error.message }
      );
    }
});




export default router;