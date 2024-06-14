const { body, validationResult } = require('express-validator');

const userValidationRules = (method) => {
  switch (method) {
    case 'createUser':
      return [
        body('username')
          .isString()
          .isLength({ max: 20 })
          .withMessage('Username must be a string with a maximum length of 20 characters')
          .notEmpty()
          .withMessage('Username is required'),
        body('password')
          .isString()
          .isLength({ min: 6, max: 20 })
          .withMessage('Password must be between 6 and 20 characters')
          .notEmpty()
          .withMessage('Password is required'),
        body('email')
          .isEmail()
          .withMessage('Email is not valid')
          .notEmpty()
          .withMessage('Email is required')
      ];
    case 'updateUser':
      return [
        body('username')
          .optional()
          .isString()
          .isLength({ max: 20 })
          .withMessage('Username must be a string with a maximum length of 20 characters'),
        body('password')
          .optional()
          .isString()
          .isLength({ min: 6, max: 20 })
          .withMessage('Password must be between 6 and 20 characters'),
        body('email')
          .optional()
          .isEmail()
          .withMessage('Email is not valid'),
        body('name')
          .optional()
          .isString(),
        body('surname')
          .optional()
          .isString()
      ];
    default:
      return [];
  }
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  userValidationRules,
  validate
};
