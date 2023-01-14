const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
        email: {
          type: String,
          lowercase: true,
          unique: true,
          required: [true, "can't be blank"],
          match: [/\S+@\S+\.\S+/, 'is invalid'],
          index: true,
        },
        nummer:{
          type: String
        }
	},
	{ timestamps: true, collection: 'waitlist'},
);

//init model
module.exports = mongoose.model('Waitlist', UserSchema)