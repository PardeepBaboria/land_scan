module.exports = (error, request, response, next) => {

	if(error.isOperational) {
		return response.status(error.statusCode).json({
			status: error.status,
			message: error.message
		});
	}

	if(
		error?.message.includes('validation failed') || 
		error?.message.includes('duplicate key') ||
		error?.message.includes('Cast to ObjectId failed') ||
		error?.message.includes('Can\'t extract geo') ||
		error?.message.includes('jwt')
	) {
		return response.status(400).json({
			status: 'fail',
			message: error.message
		});
	}

	console.error('ERROR', error);

	return response.status(500).json({
		status: 'error',
		message: 'Something went wrong!'
	});
};