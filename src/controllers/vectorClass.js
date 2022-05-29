const
	VectorClass = require('../models/vectorClass'),
	catchAsync = require('../../utils/catchAsync');

exports.list = catchAsync(async (request, response, next) => {

	const
		filter = {},
		{vector_class_id, vector_class_uid} = request.query;

	if(vector_class_id) {
		filter._id = vector_class_id;
	}
	
	if(vector_class_uid) {
		filter.uid = vector_class_uid;
	}

	const vectorClasses = await VectorClass.find(filter)
		.sort({uid: 1})
		.select('id uid name slug')
		.lean();

	response.status(200).json({
		status: 'success',
		data: vectorClasses,
	});
});