const express = require("express")
const router = express.Router()
const validators = require('../middlewares/validator.middleware')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')


router.post('/register',validators.registerUserValidator,authController.registerUser)
router.post("/login", validators.loginUserValidator, authController.loginUser);
router.get('/me', authMiddleware.authMiddleware, authController.getCurrentUser)
router.get("/logout", authController.logoutUser);


module.exports = router