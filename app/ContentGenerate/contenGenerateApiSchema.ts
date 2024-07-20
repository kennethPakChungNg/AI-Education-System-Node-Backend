import {body} from 'express-validator';
import moment from 'moment';

const isTimestemp = (value)=>{
    const momentConvert = moment.unix(Number(value)); 
    //= moment(value, 'YYYY-MM-DD HH:mm:ss', true)
    return momentConvert.isValid();
  }
  

const answerUserQuestionSchema = [
    body('WalletAddress').isString().notEmpty().withMessage("Must include WalletAddress"),
    body("CourseId").isString().notEmpty().withMessage("Must include courseId"),
    body("TopicId").isString().notEmpty().withMessage("Must include topicId"),
    body("SubTopicId").isString().optional().withMessage("Must include topicId"),
    body('Message').isString().notEmpty().withMessage("Must include message"),
]

const generateQuizSchema = [
    body('WalletAddress').isString().notEmpty().withMessage("Must include WalletAddress"),
    body("CourseId").isString().notEmpty().withMessage("Must include courseId"),
    body("TopicId").isString().notEmpty().withMessage("Must include topicId"),
    body("SubTopicId").isString().notEmpty().withMessage("Must include topicId"),
]


const genEducateImage = [
    body('WalletAddress').isString().notEmpty().withMessage("Must include walletAddress."),
    body('Message').isString().notEmpty().withMessage("Must include message"),
    body("CourseId").isString().notEmpty().withMessage("Must include courseId"),
    body("TopicId").isString().notEmpty().withMessage("Must include topicId"),
    body("SubTopicId").isString().notEmpty().withMessage("Must include subTopicId")
]



export  {
    answerUserQuestionSchema,
    generateQuizSchema ,
    genEducateImage
}