const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String,
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product'
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1
        },
        price: {
          amount: {
            type: Number,
            required: true
          },
          currency: {
            type: String,
            required: true,
            enum: ['USD', 'INR']
          }
        }
      }
    ],

    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'SHIPPED', 'DELIVERED'],
      default: 'PENDING'
    },

    totalPrice: {
      amount: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        required: true,
        enum: ['INR', 'USD']
      }
    },

    shippingAddress: {
      type: addressSchema,
      require:true
    }
  },
  { timestamps: true }
);

const OrderModel = mongoose.model('Order', orderSchema);
module.exports = OrderModel;
