const
	express = require('express'),
	authenticationController = require('../controllers/authentication'),
	vectorClassController = require('../controllers/vectorClass'),
	router = express.Router();

router.get('/list', authenticationController.protect, vectorClassController.list);

module.exports = router;