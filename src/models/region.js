const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema(
	{
		uid: {
			type: Number,
			required: [true, 'A region must have a uid'],
			unique: true,
		},
		name: {
			type: String,
			required: [true, 'A region must have a name'],
			unique: true,
			trim: true,
			maxlength: [40, 'A region name must have less or equal then 30 characters'],
			minlength: [2, 'A region name must have more or equal then 2 characters']
		},
		description: {
			type: String,
			trim: true
		},
		location: {
			type: {
				type: String,
				default: 'Polygon',
				enum: ['Polygon']
			},
			coordinates: [[[Number]]],
		},
		owner: {
			type: mongoose.Schema.ObjectId,
			ref: 'user'
		},
	},
	{
		timestamps: true,
	}
);

regionSchema.index({uid: 1});
regionSchema.index({location: '2dsphere'});

module.exports = mongoose.model('region', regionSchema);