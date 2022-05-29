const
	Region = require('../models/region'),
	RegionVector = require('./../models/regionVector'),
	VectorClass = require('./../models/vectorClass'),
	catchAsync = require('../../utils/catchAsync'),
	AppError = require('./../../utils/appError');

/**
 * TODO: 
 * --------
 * Filter 
 * --------
	a. Class Name
	b. Area
	c. Perimeter
	d. Region (UID)
	e. Polygon (a geojson to filter vectors which fall inside this polygon)
 */
exports.list = catchAsync(async (request, response, next) => {

	const 
		filter = {},
		{
			region_id,
			region_uid,
			region_vector_id,
			region_vector_uid,
		} = request.body?.filter || {};

	if(region_vector_id) {
		filter._id = region_vector_id;
	}

	if(region_vector_uid) {
		filter.uid = region_vector_uid;
	}

	const regionVectors = await RegionVector
		.find(filter)
		.populate({
			path:'region',
			select:'uid name description location',
		})
		.populate({
			path:'class',
			select:'id uid name slug',
		})
		.select(`
			uid
			name
			description
			polygon
			class
			region
			owner
		`);

	response.status(200).json({
		status: 'success',
		data: regionVectors,
	});
});

exports.insert = catchAsync(async (request, response, next) => {

	const
		{region_id, class_id} = request.body,
		recentRegionVector = await RegionVector.findOne().sort({uid: -1}).select('uid'),
		uid = recentRegionVector?.uid + 1 || 8001;

	if(!region_id || !(await Region.findById(region_id))) {
		return next(new AppError('Please specify a valid Region Id.', 400));
	}

	if(!class_id || !(await VectorClass.findById(class_id))) {
		return next(new AppError('Please specify a valid Class Id.', 400));
	}

	const payload = {
		uid: uid,
		name: request.body.name,
		description: request.body.description,
		polygon: {
			coordinates: request.body.polygon?.coordinates,
		},
		class: class_id,
		region: region_id,
		owner: request.user.id,
	};

	const newRegionVector = await RegionVector.create(payload);

	request.query.region_id = newRegionVector.id;

	next();
});

exports.update = catchAsync(async (request, response, next) => {

	const 
		{region_vector_id} = request.params,
		{class_id} = request.body;

	if(!class_id || !(await VectorClass.findById(class_id))) {
		return next(new AppError('Please specify a valid Class Id.', 400));
	}

	const regionVector = await RegionVector.findById(region_vector_id);

	regionVector.name = request.body.name;
	regionVector.description = request.body.description;
	regionVector.polygon.coordinates = request.body.polygon.coordinates;
	regionVector.class = class_id;

	await regionVector.save();

	request.query.region_vector_id = regionVector.region_vector_id;

	next();
});

exports.delete = catchAsync(async (request, response, next) => {

	const {region_vector_id} = request.params;

	await RegionVector.findByIdAndDelete(region_vector_id);

	response.status(200).json({status: 'success'});
});