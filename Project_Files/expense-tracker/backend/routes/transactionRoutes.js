const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// Get transactions (optionally filtered by month)
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { month } = req.query; // format YYYY-MM

    const query = { userId };

    if (month) {
      const [year, m] = month.split('-').map(Number);
      const start = new Date(year, m - 1, 1);
      const end = new Date(year, m, 1);
      query.date = { $gte: start, $lt: end };
    }

    const txs = await Transaction.find(query).populate('categoryId');
    res.json(txs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amount, type, categoryId, date, description } = req.body;

    const tx = await Transaction.create({
      userId,
      amount,
      type,
      categoryId,
      date: date ? new Date(date) : new Date(),
      description
    });

    res.status(201).json(tx);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const update = { ...req.body };
    if (update.date) update.date = new Date(update.date);

    const tx = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      update,
      { new: true }
    );
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    res.json(tx);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const tx = await Transaction.findOneAndDelete({ _id: id, userId });
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
