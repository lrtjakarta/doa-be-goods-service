const express = require('express');
const router = express.Router();
const locationController = require('../controller/LocationController');

router.get('/', locationController.getAll);
router.get('/:_id', locationController.getById);
router.post('/add', locationController.add);
router.post('/addMany', locationController.addMany);
router.put('/update/:_id', locationController.update);
router.delete('/delete/:_id', locationController.delete);

module.exports = router;
