const
	{promisify} = require('util'),
	config = require('config'),
	jwt = require('jsonwebtoken'),
	User = require('./../models/user'),
	Region = require('./../models/region'),
	RegionVector = require('./../models/regionVector'),
	catchAsync = require('./../../utils/catchAsync'),
	AppError = require('./../../utils/appError');

const accessToken = id => {
	return jwt.sign({id}, config.get('access_secret'), {
		expiresIn: '1h'
	});
};

const createSendToken = (user, statusCode, request, response) => {

	const access_token = accessToken(user._id);

	user.password = undefined;

	response.status(statusCode).json({
		status: 'success',
		access_token,
		data: {user}
	});
};

exports.signin = catchAsync(async (request, response, next) => {

	const {email, password} = request.body;

	let user = await User.findOne({email}).select('+password');

	if(!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError('Incorrect email or password', 401));
	}

	createSendToken(user, 200, request, response);
});

exports.signup = catchAsync(async (request, response, next) => {

	const {name, email, password} = request.body;

	let newUser = await User.create({
		name,
		email,
		password,
		is_email_verified: false,
	});

	createSendToken(newUser, 201, request, response);
});

exports.protect = catchAsync(async (request, response, next) => {

	let token;

	if(request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
		token = request.headers.authorization.split(' ')[1];
	}

	if(!token) {
		return next(new AppError('You are not logged in! Please sign in to get access.', 401));
	}

	const decoded = await promisify(jwt.verify)(token, config.get('access_secret'));

	const currentUser = await User.findById(decoded.id);

	if(!currentUser) {
		return next(new AppError('The user belonging to this token does no longer exist.', 401));
	}

	request.user = currentUser;

	next();
});

exports.restrictTo = (role) => {

	return catchAsync(async (request, response, next) => {

		if(role == 'region_owner') {

			const {region_id} = request.params;

			if(!region_id) {
				return next(new AppError('Must to Specify Region Id', 400));
			}

			if(await Region.findOne({_id: region_id, owner: request.user.id})) {
				return next();
			}
		} else if(role == 'region_vector_owner') {

			const {region_vector_id} = request.params;

			if(!region_vector_id) {
				return next(new AppError('Must to Specify Region Id', 400));
			}

			if(await RegionVector.findOne({_id: region_vector_id, owner: request.user.id})) {
				return next();
			}
		}

		return next(new AppError('You do not have permission to perform this action', 403));
	});
};