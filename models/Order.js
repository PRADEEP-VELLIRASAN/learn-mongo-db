const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerAddress: { type: String, required: true },
  customerPhone: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);