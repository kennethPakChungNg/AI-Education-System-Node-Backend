import {body} from 'express-validator';

import { CourseOutline } from './models/CourseOutline';
const key_CourseOutline = Object.keys( CourseOutline.schema.paths )

const queryCourseOutline = [
    body('WalletAddress').isString().notEmpty().withMessage("Must include WalletAddress"),
    body("courseId").isString().optional(),
    body("requiredField").isArray().withMessage("Must be an array list.")
        .optional()
        .custom((values) => {
            for (const value of values) {
              if (!key_CourseOutline.includes(value)) {
                throw new Error(`Invalid value: ${value}`);
              }
            }
            return true;
          })
]

const updateLearningStatus = [
  body('WalletAddress').isString().notEmpty().withMessage("Must include WalletAddress"),
  body("CourseId").isString().notEmpty(),
  body("TopicId").isString().notEmpty().withMessage("Must include topicId"),
  body("SubTopicId").isString().notEmpty().withMessage("Must include subTopicId"),
  body("isCompleted").isBoolean().notEmpty().withMessage("Must include isCompleted"),
]

const updateCourseName  = [
  body('WalletAddress').isString().notEmpty().withMessage("Must include WalletAddress"),
  body("CourseId").isString().notEmpty(),
  body("CourseName").isString().notEmpty().withMessage("Must include CourseName")
]

export  {
    queryCourseOutline,
    updateLearningStatus,
    updateCourseName 
}