const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user.model')
const PaymentHistory = require('./models/payment.history')
const Expenses = require('./models/expenses');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb+srv://root:admin@cluster0.z1mdj.mongodb.net/mongoTest?retryWrites=true&w=majority')

app.post('/api/register', async (req, res) => {
	console.log(req.body)
	try {
		const newPassword = await bcrypt.hash(req.body.password, 10)
		await User.create({
			name: req.body.name,
			email: req.body.email,
			flatNo:req.body.flatNo,
			password: newPassword,
			amount:0,
			messageFromAdmin:"Please pay by end of the month",
			submitted: false,
			paid: true,

		})
		res.json({ status: 'ok' })
	} catch (err) {
		res.json({ status: 'error', error: 'Duplicate email' })
	}
})

app.post('/api/login', async (req, res) => {
	const user = await User.findOne({
		email: req.body.email,
	})

	if (!user) {
		return { status: 'error', error: 'Invalid login' }
	}

	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		user.password
	)

	if (isPasswordValid) {
		const token = jwt.sign(
			{
				name: user.name,
				email: user.email,
			},
			'secret123'
		)

		return res.json({ status: 'ok', user: token })
	} else {
		return res.json({ status: 'error', user: false })
	}
})

app.get('/api/UserDetails', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email
		const user = await User.findOne({ email: email })

		const payHis = await PaymentHistory.find({ email: email})

		const forAdminUnpaid = await User.find({ paid: false, submitted:false,name:{$ne:"admin"}})
        const forAdminSubmitted = await User.find({ submitted:true,paid:false,amount:10000})
		
		const forAdminTotalPaid = await User.find({ paid:true})

		const forAdminAllUsers = await User.find({name:{$ne:"admin"}});

		const expenses = await Expenses.find();
		//console.log(forAdminAllUsers);
		//console.log(payHis);
        //console.log(forAdminUnpaid);
		//console.log(forAdminSubmitted);
		

		//console.log(forAdminTotalPaid.length);
		
		return res.json({ status: 'ok', quote: user.quote,amount:user.amount, name:user.name, messageFromAdmin: user.messageFromAdmin, flatNo:user.flatNo,payHis:payHis,forAdminUnpaid:forAdminUnpaid,forAdminSubmitted:forAdminSubmitted,forAdminTotalPaid:forAdminTotalPaid.length,forAdminAllUsers:forAdminAllUsers,expenses:expenses})
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})

app.post('/api/UserDetails', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email
		await User.updateOne(
			{ email: email },
			{ $set: { quote: req.body.quote } }
		)

		return res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})

app.post('/api/paySubmit', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email
		await User.updateOne(
			{ email: email },
			{ $set: { messageFromAdmin: "Request will be Reviewed by the Admin and status will be updated.",submitted:true } }
		)

		return res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})

async function updateAmount(email,amount){
	await User.updateOne(
		{ email: email },
		{ $set: { messageFromAdmin: "Please pay by end of the month",submitted:false, paid:false,amount: amount*1.02 +10000 } });
}

app.post('/api/adminRefreshPayments', async (req, res) => {
	const token = req.headers['x-access-token'] 

	try {
		const decoded = jwt.verify(token, 'secret123')
		const user = await User.find({  },);
        user.forEach(element => {
		    //console.log(element);
		   updateAmount(element.email,element.amount);
			});


		return res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})


app.post('/api/jitrefresh', async (req, res) => {
	const token = req.headers['x-access-token'] 

	try {
		const decoded = jwt.verify(token, 'secret123')
		await User.updateMany(
			{  },
			{ $set: { messageFromAdmin: "Please pay by end of the month",submitted:false, paid:false,amount:10000} }
		)

		return res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})

app.post('/api/submitApprove', async (req, res) => {
	const token = req.headers['x-access-token']
    //console.log(req.body.submitApproveVariable);
	try {
		const decoded = jwt.verify(token, 'secret123')
		const user = await User.findOne({name: req.body.submitApproveVariable})
		await User.updateOne(
			{ name: req.body.submitApproveVariable },
			{ $set: { paid:true,submitted:false,amount:0 } }
			)

        console.log(user.name);
		await PaymentHistory.create(

			{
                 name:user.name,
				 email: user.email,
				 amount: 10000,
				 flatNo:user.flatNo,
				 date: new Date()
			}
		)	
		
        
		return res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})

app.post('/api/submitDisApprove', async (req, res) => {
	const token = req.headers['x-access-token']
    //console.log(req.body.submitApproveVariable);
	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email
		await User.updateOne(
			{ name: req.body.submitApproveVariable },
			{ $set: { paid:false,submitted:false,amount:10000, messageFromAdmin:"Your Resquest has been Rejected please contact Admin" } }
		)

		return res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})

app.listen(1337, () => {
	console.log('Server started on 1337')
})
