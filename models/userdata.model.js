const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
	  provider: {type: String, required: true,},
	  name: {
			familyName: String,
			firstName: String
	  },
	  email: {
		type: String,
		lowercase: true,
		unique: true,
		required: [true, "can't be blank"],
		match: [/\S+@\S+\.\S+/, 'is invalid'],
		index: true,
	  },
	  password:{
		type: String
	  },
	  weights: [
		{	
			date: {type: Date, required: true, default: () => new Date().slice(0,10)},
			weight: {type: Number}
		}
	  ],
	  workouts: [
		{
			date: {type: Date, required: true},
			exercises: [{
				exercise: {type: String, required: true},
				sets: {type: Number},
				reps: {type: Number},
				weight: {type: Number},
				duration: {type: Number},
			}]
		}

	  ],
	  
	  defaultWorkoutList: [
		{	
			_id: false,
			exercise: {type: String},
			checked: {type:Boolean, default: false},
			id: {type:String, required: true, unique: true}
		}
	  ],
	  workoutsList: [
		{	
			year: {type: Number},
			week: {type: Number},
			exercises: [
				{	
					id: {type:String, required: true, unique: true},
					_id: false,
					exercise: {type: String},
					checked: {type: Boolean, default: false}
				}
			]
		}

	  ],
	  kalorien: [
		{
			date: {type: Date, required: true},
			mahlzeiten: [{
				mahlzeit: {type: String, required: true},
				gewicht: {type: Number},
				kalorien: {type: Number, required: true}
			}]

		}
	  ],
	  confirmed: {type: Boolean, required: true, default: false},
	  sendDailyEmail: {type: Boolean, required: true, default: true}
	},
	{ timestamps: true, collection: 'users'},
);

//init model
module.exports = mongoose.models['User'] || mongoose.model('User', UserSchema)