const express = require('express')
const createAuthMiddleware = require('../middlewares/auth.middleware')
const orderController = require('../controllers/order.controller')
const validation = require('../middlewares/validation.middleware')



const router = express.Router()


router.post('/',createAuthMiddleware(['user']),validation.createOrderValidation,orderController.createOrder)

router.get('/me', createAuthMiddleware(['user']), orderController.getMyOrders)

router.post('/:id/cancel',createAuthMiddleware(['user']),orderController.cancelOrderById)

router.get('/:id',createAuthMiddleware(['user','admin']),orderController.getOrderById)

module.exports = router