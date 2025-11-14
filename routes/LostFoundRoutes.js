const express = require('express');
const router = express.Router();
const lostFoundController = require('../controller/LostFoundController');

router.get('/', lostFoundController.getAll);
router.get('/all', lostFoundController.getAllLimit);
router.get('/expired', lostFoundController.getAllByExpired);
router.get('/:_id', lostFoundController.getById);
router.post('/add', lostFoundController.add);
router.put('/update/:_id', lostFoundController.update);
router.post('/updateMany', lostFoundController.updateManyData);
router.delete('/delete/:_id', lostFoundController.delete);

module.exports = router;
