const
	express = require('express'),
	cors = require('cors'),
	morgan = require('morgan'),
	AppError = require('../utils/appError'),
	globalErrorHandler = require('../utils/globalErrorHandler'),
	routes = require('./routes'),
	app = express();

app.use(cors());

app.use(express.json());

app.use(morgan(':date[iso] - :method - :status - :res[content-length]\t:response-time ms\t:url'));

app.use('/api/v1', routes);

app.all('*', (request, response, next) => {
	next(new AppError(`Can't find ${request.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;