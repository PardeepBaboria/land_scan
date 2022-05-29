const mongoose = require('mongoose');

const vectorClassSchema = new mongoose.Schema(
	{
		uid: {
			type: Number,
			required: [true, 'A vector class must have a uid'],
			unique: true,
		},
		name: {
			type: String,
			trim: true,
			required: [true, 'A vector class must have a name'],
		},
		slug: {
			type: String,
			trim: true,
			lowercase: true,
			required: [true, 'A vector class must have a slug'],
		},
		description: {
			type: String,
			trim: true
		},
		active: {
			type: Boolean,
			default: true,
			select: false
		},
	},
	{
		timestamps: true
	}
);

vectorClassSchema.pre(/^find/, function(next) {

	this.find({active: {$ne: false}});

	next();
});

module.exports = mongoose.model('vector_class', vectorClassSchema);