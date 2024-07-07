import mongoose from 'mongoose';
import {v1}  from "uuid"; 


const collectionName = 'userBackground';
//a ticket
const userBackgroundModel = new mongoose.Schema(
    {
        _id: { type: String, default: v1 
        },
        WalletAddress:{
            type:String
        },
        Name: { type: String },
        EducationLevel: { 
            type: String 
        },
        EducationBackground: { 
            type: String 
        },
        Subject: { 
            type: String 
        }, // For university/college major
        WorkIndustry: { 
            type: String 
        },
        WorkExperience: { 
            type: String 
        },
        TeachingStyle: { 
            type: String 
        },
        LearningStyle: { 
            type: String 
        },
        LearningMaterialTextPercent: { 
            type: Number 
        },
        LearningMaterialImagePercent: { 
            type: Number 
        },
        LearningMaterialVideoPercent: { 
            type: Number 
        },
        Interest: { 
            type: String 
        },
        Remarks: { 
            type: String 
        }
    },
    {
        collection: collectionName 
    }
);


mongoose.connection.collection(collectionName);
const db_related = mongoose.connection.useDb("aiEducation");
const UserBackground = db_related.model( collectionName , userBackgroundModel );

export { UserBackground }