const BillingCycle = require('./billing-cycle-schema');
const errorHandler = require('../common/errorHandler');

BillingCycle.methods(['get', 'post', 'put', 'delete']);
BillingCycle.updateOptions({ new: true, runValidators: true });
BillingCycle
  .after('post', errorHandler)
  .after('put', errorHandler);

BillingCycle.route('count', (req, res) => {
  BillingCycle.count((err, value) => {
    if (err) {
      res.status(500).send({ error: [err] });
      return;
    }

    res.status(200).json({ value });
  });
});

BillingCycle.route('summary', (req, res) => {
  const project = {
    $project: {
      credit: { $sum: '$credits.value' },
      debts: { $sum: '$debts.value' },
    }
  };

  const group = {
    $group: {
      _id: null,
      credit: { $sum: '$credit' },
      debt: { $sum: '$debts' }
    }
  };

  const projectFinish = {
    $project: {
      credit: true,
      debt: true,
      _id: false
    }
  };

  BillingCycle.aggregate([project, group, projectFinish], (err, summary) => {
    if (err) {
      res.status(500).send({ error: [err] });
      return;
    }

    res.status(200).json(summary[0] || { credit: 0, debt: 0 });
  });
});

module.exports = BillingCycle;
