const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET list
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const { name, age, grade, email } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const student = new Student({ name, age, grade, email });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Student.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
