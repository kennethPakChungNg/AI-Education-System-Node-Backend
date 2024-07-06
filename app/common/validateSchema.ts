import { validationResult } from 'express-validator';
import httpStatus from 'http-status';

const validateSchema = () => {
    return (req, res, next) => {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // If there are errors, return a response with the validation errors
        return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
      }
  
      // If validation passed, proceed to the next middleware or route
      next();
    };
}; 

export default validateSchema;