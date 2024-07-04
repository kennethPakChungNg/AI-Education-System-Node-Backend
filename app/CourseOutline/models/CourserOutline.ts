import mongoose from 'mongoose';
import {v1}  from "uuid"; 


const collectionName = 'courseOutline';
//a ticket
const courseOutlineModel = new mongoose.Schema(
    {
        _id: { type: String, default: v1 
        },
        courseId:{
            type: String
        },
        WalletAddress:{
            type:String
        },
        courseName: { 
            type: String 
        },
        courseOutline: { 
            type: Object 
        },
        createDate:{
            type: Date
        },
        lastModifiedDate:{
            type:Date
        }
    },
    {
        collection: collectionName 
    }
);


mongoose.connection.collection(collectionName);
const db_related = mongoose.connection.useDb("aiEducation");
const CourseOutline = db_related.model( collectionName , courseOutlineModel );

export { CourseOutline }