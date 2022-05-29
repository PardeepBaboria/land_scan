const
	express = require('express'),
	authenticationController = require('../controllers/authentication'),
	router = express.Router();

router.post('/sign-in', authenticationController.signin);
router.post('/sign-up', authenticationController.signup);

module.exports = router;