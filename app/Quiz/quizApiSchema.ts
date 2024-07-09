import {body} from 'express-validator';

const calQuizResultSchema = [
    body('WalletAddress').isString().notEmpty().withMessage("Must include walletAddress."),
    body("CourseId").isString().notEmpty().withMessage("Must include courseId"),
    body("TopicId").isString().notEmpty().withMessage("Must include topicId"),
    body("SubTopicId").isString().notEmpty().withMessage("Must include subTopicId"),
    body("QuizId").isString().notEmpty().withMessage("Must include quizId"),
    body("SubmittedAnswer").isArray().notEmpty().withMessage("Must include SubmittedAnswer"),
    body("SubmissionId").isString().optional()
]


export  {
    calQuizResultSchema
}