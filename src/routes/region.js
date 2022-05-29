const
	express = require('express'),
	{protect, restrictTo} = require('../controllers/authentication'),
	regionController = require('../controllers/region'),
	router = express.Router();

router.get('/list', protect, regionController.list);
router.post('/insert', protect, regionController.insert, regionController.list);
router.put('/:region_id/update', protect, restrictTo('region_owner'), regionController.update, regionController.list);
router.delete('/:region_id/delete', protect, restrictTo('region_owner'), regionController.delete);

module.exports = router;