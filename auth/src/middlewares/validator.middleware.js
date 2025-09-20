const { body, validationResult } = require('express-validator')


const responseWithValidationError = (req, res, next) => { 
    const error = validationResult(req);
    if (!error.isEmpty()) { 
        return res.status(400).json({error:error.array()})
    }
    next()
}

const registerUserValidator = [
    body('username')
        .isString()
        .withMessage("user must be string")
        .isLength({ min: 3 })
        .withMessage("user must be at least 3 charecter long"),
    body("email")
        .isEmail()
        .withMessage("Invalid email address"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("password must be 6 charecter long"),
    body("fullName.firstName")
        .isString()
        .withMessage("First name must be string")
        .notEmpty()
        .withMessage("First name is required"),
    
     body("fullName.lastName")
        .isString()
        .withMessage("Last name must be string")
        .notEmpty()
        .withMessage("Last name is required"),
     responseWithValidationError
]


const loginUserValidator = [
    body('email')
        .isEmail()
        .optional()
        .withMessage("invalid email"),
    
    body('username')
        .optional()
        .isString()
        .withMessage('user must be a string'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 charecters long'),
    
    (req, res, next) => { 

        if (!req.body.email && !req.body.username) { 
            return res.status(400).json({
                message:"Either email or password is require"
            })
        }

        responseWithValidationError(req,res,next)
    }
    
    
    
]


const addUserAddressValidation = [
  body("street")
    .notEmpty()
    .withMessage("Street is required")
    .isLength({ min: 3 })
    .withMessage("Street must be at least 3 characters"),

  body("city")
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2 })
    .withMessage("City must be at least 2 characters"),

  body("state")
    .notEmpty()
    .withMessage("State is required")
    .isLength({ min: 2 })
    .withMessage("State must be at least 2 characters"),


  body("pincode")
    .notEmpty()
    .withMessage("Pincode is required")
    .isPostalCode("IN")
    .withMessage("Invalid pincode"), // You can change region

  body("country").notEmpty().withMessage("Country is required"),

  body("isDefault")
    .optional()
    .isBoolean()
        .withMessage("isDefault must be a boolean"),
  
  responseWithValidationError
];


module.exports = {
    registerUserValidator,
    loginUserValidator,
    addUserAddressValidation
}