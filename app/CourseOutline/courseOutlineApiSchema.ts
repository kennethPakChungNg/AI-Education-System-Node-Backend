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



export  {
    queryCourseOutline
}