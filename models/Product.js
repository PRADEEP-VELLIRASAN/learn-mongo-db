const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // URL to image
  weight: { type: String, default: '1kg' }, // e.g., '500g', '2kg'
  stock: { type: Number, default: 10 } // Quantity in stock
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
