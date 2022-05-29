const
	express = require('express'),
	router = express.Router(),
	swaggerUi = require('swagger-ui-express'),
	swaggerDocSpec = require('../../utils/swagger'),
	authenticationRoute = require('./authentication'),
	vectorClassRoute = require('./vectorClass'),
	regionRoute = require('./region'),
	regionVectorRoute = require('./regionVector');

router.use('/doc/e5y9xM16ZG',swaggerUi.serve, swaggerUi.setup(swaggerDocSpec, {explorer: true}));
router.use('/authentication', authenticationRoute);
router.use('/vector-class', vectorClassRoute);
router.use('/region', regionRoute);
router.use('/region-vector', regionVectorRoute);

module.exports = router;