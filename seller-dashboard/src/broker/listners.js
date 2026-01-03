const { subscribeToQueue } = require("./broker");
const userModel = require("../models/user.model");
const ProductModel = require("../models/products.model");
const OrderModel = require("../models/order.model");
const paymentModel = require("../models/payment.model");


module.exports = async function () {
    subscribeToQueue('AUTH_SELLER_DESHBOARD.USER_CREATED', async (user) => {
        await userModel.create(user)
    })

    subscribeToQueue('PRODUCTS_SELLER_DESHBOARD.PRODUCT_CREATED', async (product) => {
        await ProductModel.create(product)
    })

    subscribeToQueue('ORDER_SELLER_DASHBOARD.ORDER_CREATED', async (order) => {
        await OrderModel.create(order)
    })

    subscribeToQueue('PAYMENT_SELLER_DASHBOARD.PAYMENT_CREATED', async (payment) => {
        await paymentModel.create(payment)
    })

    subscribeToQueue('PAYMENT_SELLER_DASHBOARD.PAYMENT_UPDATED', async (payment) => {
        await paymentModel.findOneAndUpdate({ orderId:payment.orderId }, payment)
    })
}