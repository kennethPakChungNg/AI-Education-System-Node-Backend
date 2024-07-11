
import {CourseOutline} from './models/CourseOutline'
import {logger} from '../common'

const queryCourseOutline = async (filter={}, selectedField = '') => {
	try {
        let returnFromDb = null;
        if ( selectedField == '' ){
            returnFromDb = await CourseOutline.find(filter);
        }else{
            returnFromDb = await CourseOutline
                .find(filter)
                .select(selectedField);
        }
		
        return returnFromDb;
	}catch (error) {
		throw new error(`Error from queryCourseOutline: ${error.stack}`)
	}
};

const saveCourseOutline = async (data) => {
	try {
        const searchCourse = {
            "WalletAddress": data.WalletAddress,
            "courseName":data.courseName
        };
        
        const courseRegistered = await queryCourseOutline(searchCourse);

        let returnFromDb;
        if (courseRegistered.length > 0) {
            returnFromDb = await CourseOutline.findOneAndUpdate(
                searchCourse,
                { $set: data },
                { new: true, omitUndefined: true }
              );
        }else{
            returnFromDb = await CourseOutline.create(data);
        }
		 
        return returnFromDb;
	}catch (error) {
		throw new error(`Error from saveCourseOutline: ${error.stack}`)
	}
};

export {
    queryCourseOutline,
    saveCourseOutline
}

