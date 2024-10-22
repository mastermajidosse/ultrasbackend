// import mongoose from 'mongoose';

// const orderSchema = mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'User',
//   },
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'Product',
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     default: 1,
//   },
//   totalPrice: {
//     type: Number,
//     required: true,
//   },

// },
//   {
//     timeStamps: true
//   });

// const Order = mongoose.model('Order', orderSchema);

// export default Order;
import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This will be null for anonymous users
  },
  email: {
    type: String, // Required if no user is logged in
    required: function () {
      return !this.user; // Only required if no user is associated with the order
    },
  },
  phone: {
    type: String, // Required if no user is logged in
    required: function () {
      return !this.user; // Only required if no user is associated with the order
    },
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true, // Fix typo: timestamps should be lowercase
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
