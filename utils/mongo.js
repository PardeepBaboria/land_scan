const
	mongoose = require("mongoose"),
	config = require('config');

exports.connect = async ()=> {

	try {

		if(!config.has('mongo_db_url')) {
			throw new Error('Mongo DB Url not defined in file.');
		}

		const 
			start = new Date(),
			dbUrl = config.get('mongo_db_url');

		await mongoose.connect(dbUrl, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				autoIndex: true,
			}
		);

		console.log(
			'Mongo DB Connection:\n\t\b',
			`connected - ${new Date() - start}ms`
		);
	} catch(e) {

		console.error("Error connecting to DB");

		console.log(e.name, e.message);

		throw e;
	}
}