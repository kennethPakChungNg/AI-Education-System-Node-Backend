import { timeStamp } from 'console';
import mongoose from 'mongoose';
import {v1}  from "uuid"; 


const collectionName = 'educateConversation';
//a ticket
const educateConversationModel = new mongoose.Schema(
    {
        _id: { type: String, default: v1 
        },
        Role:{
            type: String
        },
        WalletAddress:{
            type:String
        },
        CourseId:{
            type: String
        },

        TopicId: { 
            type: String 
        },
        SubTopicId: { 
            type: Object 
        },
        ConversationTimestamp:{
            type: String
        },
        ConversationDateTime:{
            type: Date
        },
        Message:{
            type:String
        },
        HashedMsg:{
            type:String
        }

    },
    {
        collection: collectionName 
    }
);

educateConversationModel.index({
    WalletAddress:1,
    ConversationTime:1,
    HashedMsg:1
})


mongoose.connection.collection(collectionName);
const db_related = mongoose.connection.useDb("aiEducation");
const EducateConversation = db_related.model( collectionName , educateConversationModel );

export { EducateConversation }