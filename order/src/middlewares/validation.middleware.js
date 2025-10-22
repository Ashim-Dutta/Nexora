const {body,validationResult} = require('express-validation')


const responseWithValidationError = (req, res, next) => { 
    const error = validationResult(req);
    if (!error.isEmpty()) { 
        return res.status(400).json({error:error.array()})
    }
    next()
}


const createOrderValidation= [
  body("shippingAddress.street")
    .notEmpty()
    .withMessage("Street is required")
    .isLength({ min: 3 })
    .withMessage("Street must be at least 3 characters"),

  body("shippingAddress.city")
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2 })
    .withMessage("City must be at least 2 characters"),

  body("shippingAddress.state")
    .notEmpty()
    .withMessage("State is required")
    .isLength({ min: 2 })
    .withMessage("State must be at least 2 characters"),


  body("shippingAddress.pincode")
    .notEmpty()
    .withMessage("Pincode is required")
    .isPostalCode("IN")
    .withMessage("Invalid pincode"), // You can change region

  body("shippingAddress.country").notEmpty().withMessage("Country is required"),

  
  responseWithValidationError
];

module.exports = {
    createOrderValidation
}