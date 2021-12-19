const mongoose = require('mongoose')

const Userdatabase = new mongoose.Schema(
	{
		email: { 
			type: String, 
			required: true,
		},
		password: { 
			type: String, 
			required: true 
		},
		username: {
			type: String,
		}
	},
)

const model = mongoose.model('UserSchema', Userdatabase)

module.exports = model;

