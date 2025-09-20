const express = require("express")
const router = express.Router()
const validators = require('../middlewares/validator.middleware')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')


router.post('/register',validators.registerUserValidator,authController.registerUser)
router.post("/login", validators.loginUserValidator, authController.loginUser);
router.get('/me', authMiddleware.authMiddleware, authController.getCurrentUser)
router.get("/logout", authController.logoutUser);


router.get('/users/me/addresses', authMiddleware.authMiddleware, authController.getUserAddresses)
router.post('/users/me/addresses',validators.addUserAddressValidation,authMiddleware.authMiddleware,authController.addUserAddresses)
router.post('/users/me/addresses',validators.addUserAddressValidation,authMiddleware.authMiddleware,authController.addUserAddresses)
router.delete('/users/me/addresses/:addressId',authMiddleware.authMiddleware,authController.deleteUserAddress)

module.exports = router