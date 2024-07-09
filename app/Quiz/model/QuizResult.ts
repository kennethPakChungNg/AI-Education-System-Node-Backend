import mongoose from 'mongoose';
import {v1}  from "uuid"; 


const collectionName = 'quizResult';
//a ticket
const quizResultModel = new mongoose.Schema(
    {
        _id: { type: String, default: v1 
        },

        WalletAddress:{
            type:String
        },
        QuizId :{
            type: String
        },
        CourseId:{
            type: String
        },
        TopicId: { 
            type: String 
        },
        SubTopicId:{
            type: String
        },
        QuizResult:{
            type: Array
        },
        SubmissionId:{
            type: String
        },
        createDate:{
            type: Date,
            default: Date.now
        },
        lastModifiedDate:{
            type:Date,
            default: Date.now
        }
    },
    {
        collection: collectionName 
    }
);

/*
quizResultModel.index({
    SubmissionId:1
})
*/

mongoose.connection.collection(collectionName);
const db_related = mongoose.connection.useDb("aiEducation");
const QuizResult = db_related.model( collectionName , quizResultModel );

export { QuizResult }