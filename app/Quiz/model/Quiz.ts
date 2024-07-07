import mongoose from 'mongoose';
import {v1}  from "uuid"; 


const collectionName = 'quiz';
//a ticket
const quizModel = new mongoose.Schema(
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
            type: Object 
        },
        SubTopicId:{
            type: String
        },
        Quiz:{
            type:Object
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


mongoose.connection.collection(collectionName);
const db_related = mongoose.connection.useDb("aiEducation");
const Quiz = db_related.model( collectionName , quizModel );

export { Quiz }