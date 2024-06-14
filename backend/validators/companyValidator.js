const { body, param } = require('express-validator');

const companyValidationRules = (method) => {
  switch (method) {
    case 'create':
      return [
        body('companyName')
          .isString()
          .notEmpty()
          .withMessage('Company name is required'),
        body('password')
          .isString()
          .isLength({ min: 6, max: 60 })
          .withMessage('Password must be between 6 and 60 characters')
          .notEmpty()
          .withMessage('Password is required'),
        body('email')
          .isEmail()
          .withMessage('Email is not valid')
          .notEmpty()
          .withMessage('Email is required'),
        body('address').optional().isObject().withMessage('Address must be an object'),
        body('phone').optional().isArray().withMessage('Phone must be an array of objects'),
      ];
    case 'update':
      return [
        param('companyName')
          .isString()
          .notEmpty()
          .withMessage('Company name in URL parameter is required'),
        body('email').optional().isEmail().withMessage('Email must be valid'),
        body('password')
          .optional()
          .isString()
          .isLength({ min: 6, max: 60 })
          .withMessage('Password must be between 6 and 60 characters'),
        body('address').optional().isObject().withMessage('Address must be an object'),
        body('phone').optional().isArray().withMessage('Phone must be an array of objects'),
      ];
    default:
      return [];
  }
};

module.exports = {
  companyValidationRules
};