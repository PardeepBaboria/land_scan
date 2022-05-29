const
	fs = require('fs'),
	database = require('../utils/mongo'),
	VectorClass = require('../src/models/vectorClass');

database.connect();

// READ JSON FILE
const vectorClasses = JSON.parse(fs.readFileSync(`${__dirname}/vectorClass.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async() => {

	try {

		for(const vectorClass of vectorClasses) {
			await VectorClass.create(vectorClass);
		}

		console.log('Data successfully loaded!');
	} catch(err) {
		console.log(err);
	}

	process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async() => {

	try {

		await VectorClass.deleteMany();

		console.log('Data successfully deleted!');
	} catch(err) {
		console.log(err);
	}

	process.exit();
};

if(process.argv[2] === '--import') {
	importData();
} else if(process.argv[2] === '--delete') {
	deleteData();
}