const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET list
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const { name, price, category, description, image } = req.body;
    if (!name || !price || !category) return res.status(400).json({ error: 'Name, price, and category are required' });
    const product = new Product({ name, price: Number(price), category, description, image });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description, image } = req.body;
    const updated = await Product.findByIdAndUpdate(id, { name, price: Number(price), category, description, image }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Product.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
