    
import dotenv from 'dotenv';

import request from 'supertest';
    
import {storeQuizResult} from '../../../app/Quiz/quizController'
import mongoose from "mongoose"

beforeEach((done) => {
    dotenv.config();

    const {SERVER_MONGODB_URL } = process.env
    mongoose.connect( "mongodb://aiEduAdmin:UUVd6r4vGRKMgqF@localhost:27017/?authSource=admin" )
    done();      
});

describe('storeQuizResult', async () => {
    it('it should save quiz result', async (done) => {
        try{
            const WaletAddress = '0xqwefegewg'
            const QuizId = '1'
            const CourseId = '1'
            const TopicId = '1'
            const SubTopicId = '1'
            const QuizResult = []
            const SubmissionId = '1'
            const outline = await storeQuizResult(WaletAddress, QuizId,CourseId , TopicId, SubTopicId ,QuizResult, SubmissionId)
    
            //console.log(`COURSE OUTLINE: \n${ JSON.stringify(outline)}`);
            //done();
        }catch (error){
            console.log(error)
        }
    });
});