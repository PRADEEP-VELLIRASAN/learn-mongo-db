const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// POST create order
router.post('/', async (req, res) => {
  try {
    const { items, total, customerName, customerEmail, customerAddress, customerPhone } = req.body;
    if (!items || !total || !customerName || !customerEmail || !customerAddress || !customerPhone) return res.status(400).json({ error: 'All fields are required' });
    const order = new Order({ items, total, customerName, customerEmail, customerAddress, customerPhone });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

module.exports = router;