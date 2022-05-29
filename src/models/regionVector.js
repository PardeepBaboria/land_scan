const mongoose = require('mongoose');

const regionVectorSchema = new mongoose.Schema(
	{
		uid: {
			type: Number,
			required: [true, 'A vector must have a uid'],
			unique: true,
		},
		name: {
			type: String,
			required: [true, 'A vector must have a name'],
			unique: true,
			trim: true,
			maxlength: [40, 'A vector name must have less or equal then 30 characters'],
			minlength: [2, 'A vector name must have more or equal then 2 characters']
		},
		description: {
			type: String,
			trim: true
		},
		polygon: {
			type: {
				type: String,
				default: 'Polygon',
				enum: ['Polygon']
			},
			coordinates: [[[Number]]],
		},
		class: {
			type: mongoose.Schema.ObjectId,
			ref: 'vector_class'
		},
		region: {
			type: mongoose.Schema.ObjectId,
			ref: 'region'
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

regionVectorSchema.index({polygon: 1});
regionVectorSchema.index({region: 1});

module.exports = mongoose.model('region_vector', regionVectorSchema);