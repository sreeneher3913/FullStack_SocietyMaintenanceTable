const mongoose = require('mongoose')

const Expenses = new mongoose.Schema(
	{   expenseName: { type: String },
		expenseAmount: { type: Number },
	},
	{ collection: 'Expenses' }
)

const model = mongoose.model('Expenses', Expenses)

module.exports = model