const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  customerName: { type: String },
  customerEmail: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);