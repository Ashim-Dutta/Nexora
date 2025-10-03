const express = require("express")
const multer = require('multer')
const router = express.Router()
const productController  = require('../controllers/product.controller')
const createAuthMiddleware = require('../middlewares/auth.middleware')
const {createProductValidators} = require('../validators/product.validators')

const upload = multer({storage:multer.memoryStorage()})
router.post('/',
    createAuthMiddleware(['admin','seller']),
    upload.array('images', 5),
    createProductValidators,
    productController.createProduct
)

module.exports = router