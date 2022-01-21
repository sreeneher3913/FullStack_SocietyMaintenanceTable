const mongoose = require('mongoose')

const PaymentHistory = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, },
        flatNo: { type: String, required: true, },
        AmountPaid: { type: Number },
        date : {type : Date},

	},
	{ collection: 'PaymentHistory' }
)

const model = mongoose.model('PaymentHistory', PaymentHistory)

module.exports = model
