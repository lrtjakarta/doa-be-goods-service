const express = require('express');
const router = express.Router();
const identificationController = require('../controller/IdentificationController');

router.get('/', identificationController.getAll);
router.get('/:_id', identificationController.getById);
router.post('/add', identificationController.add);
router.post('/addMany', identificationController.addMany);
router.put('/update/:_id', identificationController.update);
router.delete('/delete/:_id', identificationController.delete);

module.exports = router;
