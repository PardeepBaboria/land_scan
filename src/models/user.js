const
	mongoose = require('mongoose'),
	validator = require('validator'),
	bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A user must have a name'],
			trim: true,
		},
		email: {
			type: String,
			unique: true,
			lowercase: true,
			trim: true,
			validate: [validator.isEmail, 'Please provide a valid email'],
		},
		password: {
			type: String,
			minlength: 6,
			select: false,
		},
		active: {
			type: Boolean,
			default: true,
			select: false,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre('save', async function(next) {

	if(!this.isModified('password')) {
		return next();
	}

	this.password = await bcrypt.hash(this.password, 12);

	next();
});

userSchema.pre(/^find/, function(next) {

	this.find({active: {$ne: false}});

	next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('user', userSchema);