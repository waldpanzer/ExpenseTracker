const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { month } = req.query; // YYYY-MM

    const query = { userId };

    if (month) {
      const [year, m] = month.split('-').map(Number);
      const start = new Date(year, m - 1, 1);
      const end = new Date(year, m, 1);
      query.date = { $gte: start, $lt: end };
    }

    const txs = await Transaction.find(query).populate('categoryId');

    let totalIncome = 0;
    let totalExpenses = 0;
    const byCategory = {};

    txs.forEach(tx => {
      if (tx.type === 'income') totalIncome += tx.amount;
      if (tx.type === 'expense') totalExpenses += tx.amount;

      const catName = tx.categoryId ? tx.categoryId.name : 'Uncategorised';
      if (!byCategory[catName]) byCategory[catName] = 0;
      byCategory[catName] += tx.amount;
    });

    const balance = totalIncome - totalExpenses;

    res.json({
      totalIncome,
      totalExpenses,
      balance,
      byCategory
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
