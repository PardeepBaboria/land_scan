
const
	config = require('config'),
	swaggerJsdoc = require('swagger-jsdoc');

module.exports = swaggerJsdoc({
	swaggerDefinition: {
		persistAuthorization: true,
		info: {
			title: 'Land Scan APIs',
			version: '2.0.0',
			description: ''
		},
		schemes: ['http'],
		host: 'localhost:' + config.get('node_port'),
		basePath: '/api/v1/',
		securityDefinitions: {
			api_key: {
				type: 'apiKey',
				name: 'Authorization',
				in: 'header'
			}
		}
	},
	apis: ['src/asserts/documentation.yaml']
});