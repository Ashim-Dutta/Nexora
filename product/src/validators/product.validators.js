const { body, validationResult } = require('express-validator')


function handleValidationErrors(req, res, next) {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({
            message:"Validation error"
        })
    }
    next()
}


const createProductValidators = [
  body('title')
    .trim()
    .notEmpty().withMessage("title is required"),

  body('description')
    .optional()
    .isString().withMessage("description must be a string")
    .trim()
    .isLength({ max: 500 }).withMessage("description max length is 500 characters"),

  body('priceAmount')
    .notEmpty().withMessage("PriceAmount is required")
    .bail()
    .isFloat({ gt: 0 }).withMessage("Price Amount must be a number greater than 0"),

  body('priceCurrency')
    .optional()
    .isIn(['USD', 'INR']).withMessage("Price Currency must be in USD or INR"),

  handleValidationErrors
];

module.exports = {
    createProductValidators
}