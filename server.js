const
	http = require('http'),
	config = require('config'),
	database = require('./utils/mongo');

process.on('uncaughtException', err => {

	console.log('UNCAUGHT EXCEPTION!');

	console.log(err?.name, err?.message, err);
});

const app = require('./src/app');

if(!config.has('node_port')) {
	throw new Error('Node Port configuration not defined in file.');
}

const
	port = process.env.PORT || config.get('node_port'),
	server = http.createServer(app);

server.listen(port, '0.0.0.0', () => {

	console.log(
		`\n**********
		\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b${config.get('namespace')} HTTP Server Started
		\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\tEnvironment:	${process.env.NODE_ENV}
		\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\tPort:		${port}\n**********`
	);
});

database.connect();

process.on('unhandledRejection', err => {

	console.log('UNHANDLED REJECTION!');

	console.log(err?.name, err?.message, err);
});

process.on('SIGTERM', () => {

	console.log('SIGTERM RECEIVED. Shutting down gracefully');

	server.close(() => {
		console.log('Process terminated!');
	});
});