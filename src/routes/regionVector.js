const
	express = require('express'),
	{protect, restrictTo} = require('../controllers/authentication'),
	regionVectorController = require('../controllers/regionVector'),
	router = express.Router();

router.post('/list', protect, regionVectorController.list);
router.post('/insert', protect, regionVectorController.insert, regionVectorController.list);
router.put('/:region_vector_id/update', protect, restrictTo('region_vector_owner'), regionVectorController.update, regionVectorController.list);
router.delete('/:region_vector_id/delete', protect, restrictTo('region_vector_owner'), regionVectorController.delete);

module.exports = router;