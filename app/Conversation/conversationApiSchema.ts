
import {body} from 'express-validator';
import logger from '../common/logger';
import moment from 'moment';

const isTimestemp = (value)=>{
    const momentConvert = moment.unix(Number(value)); 
    //= moment(value, 'YYYY-MM-DD HH:mm:ss', true)
    return momentConvert.isValid();
}
/*
Namespace of conversation role
*/
const ConversationRole = {
    SYSTEM: 'system',
    USER: 'user'
}
  


const saveConversationSchema = [
    body('WalletAddress').isString().notEmpty().withMessage("Must include walletAddress."),
    body('Role').isString()
        .notEmpty().withMessage("Must inculde role of the message")
        .custom((value: string) => {
            return Object.values(ConversationRole).includes(value);
        }).withMessage('Invalid role value'),
    body('Message').isString().notEmpty().withMessage("Must include message"),
    body("CourseId").isString().notEmpty().withMessage("Must include courseId"),
    body("TopicId").isString().notEmpty().withMessage("Must include topicId"),
    body("SubTopicId").isString().notEmpty().withMessage("Must include subTopicId"),
    body("ConversationTimestamp").custom(value => typeof value === 'number').notEmpty().custom(isTimestemp).withMessage("Must include correct timestemp")
]

const queryConversationSchema = [
    body('WalletAddress').isString().notEmpty().withMessage("Must include walletAddress."),
    body("CourseId").isString().notEmpty().withMessage("Must include courseId"),
    body("TopicId").isString().notEmpty().withMessage("Must include topicId"),
    body("SubTopicId").isString().notEmpty().withMessage("Must include subTopicId")
]


export  {
    queryConversationSchema,
    saveConversationSchema
}