import {body} from 'express-validator';

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



export  {
    answerUserQuestionSchema,
    generateQuizSchema
}