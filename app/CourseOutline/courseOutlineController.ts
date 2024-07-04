
import {CourseOutline} from './models/CourserOutline'
import {logger} from '../common'

const queryCourseOutline = async (filter={}) => {
	try {
		const returnFromDb = await CourseOutline.find(filter);
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

