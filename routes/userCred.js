const router = require('express').Router();
const User = require('.././model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var validator = require("email-validator");
var passwordValidator = require('password-validator');


const JWT_SECRET = 'dicydsgvdgddcy@#$$*$Y$uyftvtydctudcascryvcydtsudc';

router.post('/api/change-password', async (req, res) => {
	const { token, newpassword: plainTextPassword, cnfrmNewPassword } = req.body;

	var schema = new passwordValidator();

	schema
	.is().min(6)                                
	.is().max(10)                                  
	.has().uppercase(1)                             
	.has().digits(2)                                
	.has().symbols(1) 

	var newpassval = req.body.newpassword;

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if(schema.validate(newpassval)) {
		if(plainTextPassword === cnfrmNewPassword){
			try {
				const user = jwt.verify(token, JWT_SECRET)
		
				const _id = user.id
		
				const password = await bcrypt.hash(plainTextPassword, 10)
		
				await User.updateOne(
					{ _id },
					{
						$set: { password }
					}
				)
				res.json({ status: 'Password has been updated' });
			} catch (error) {
				console.log(error)
				res.json({ status: 'error', error: ';))' })
			}
		} else {
			res.status({ status: 'Newpassword and confirm password does not match'});
		}
		
	} else {
		res.json({ status: 'password should be min 6 and max 10 letters,1 caps, 2 numbers, 1 symbol' });
	}

	
})

router.post('/api/login', async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid email/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the email, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				username: user.email
			},
			JWT_SECRET
		)

		return res.json({ status: 'ok', data: token })
	}

	res.json({ status: 'error', error: 'Invalid email/password' })
})

router.post('/api/register', async (req, res) => {
	const { email, password: plainTextPassword, cnfrmPassword, username} = req.body;

	var schema = new passwordValidator();

	schema
	.is().min(6)                                
	.is().max(10)                                  
	.has().uppercase(1)                             
	.has().digits(2)                                
	.has().symbols(1)             

	const emailval = req.body.email;
	const passval = req.body.password;

	if (!email) {
		return res.json({ status: 'error', error: 'Email not entered' })
	}

	if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (!cnfrmPassword) {
		return res.json({ status: 'error', error: 'Confirm Password not entered' })
	}


	if (validator.validate(emailval)){

		if(schema.validate(passval)){
			if(plainTextPassword === cnfrmPassword){
				const password = await bcrypt.hash(plainTextPassword, 10)
		
			try {
				const response = await User.create({
					email,
					password,
					username
				})
				console.log('User created successfully: ', response)
			} catch (error) {
				if (error.code === 11000) {
					// duplicate key
					return res.json({ status: 'error', error: 'Username and Email already exists' })
				}
				throw error;
			}
		
			res.json({ status: 'Profile has been registered' })
			} else {
		
				res.json({ status: 'Password and confirm password does not match'});
			}
		} else {
			res.json({ status: 'password should be min 6 and max 10 letters,1 caps, 2 numbers, 1 symbol'})
		}	
	} else {
		res.json({ status: 'Email is invalid'})
	}	
})

module.exports = router;
