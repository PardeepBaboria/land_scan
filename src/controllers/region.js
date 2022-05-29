const
	Region = require('./../models/region'),
	catchAsync = require('../../utils/catchAsync');

/**
 * TODO: 
 * --------------
 * ADD Attributes  
 * --------------
	a. Area
	b. Perimeter
	c. Center of mass
 */
exports.list = catchAsync(async (request, response, next) => {

	const filter = {};

	if(request.query.region_id) {
		filter._id = request.query.region_id;
	}

    if(request.query.region_uid) {
		filter.uid = request.query.region_uid;
	}

	const regions = await Region.find(filter).select('uid name description location owner');

	response.status(200).json({
		status: 'success',
		data: regions,
	});
});

exports.insert = catchAsync(async (request, response, next) => {

    const 
        recentRegion = await Region.findOne().sort({uid: -1}).select('uid'),
        uid = recentRegion?.uid + 1 || 2001;

	const payload = {
		uid: uid,
		name: request.body.name,
        description: request.body.description,
		location: {
			coordinates: request.body.location?.coordinates,
		},
		owner: request.user.id,
	};

	const newRegion = await Region.create(payload);

	request.query.region_id = newRegion.id;

	next();
});

exports.update = catchAsync(async (request, response, next) => {

	const {region_id} = request.params;

    const region = await Region.findById(region_id);

    region.name = request.body.name;
    region.description = request.body.description;
    region.location.coordinates = request.body.location.coordinates;

    await region.save();

	request.query.region_id = region.region_id;

	next();
});

exports.delete = catchAsync(async (request, response, next) => {

	const {region_id} = request.params;

    await Region.findByIdAndDelete(region_id);

    response.status(200).json({status: 'success'});
});