const express = require('express');
const router = express.Router();
const GoodsComplaintController = require('../controller/GoodsComplaintController');

router.get('/', GoodsComplaintController.getAll);
router.get('/:_id', GoodsComplaintController.getById);
router.post('/add', GoodsComplaintController.add);
router.put('/update/:_id', GoodsComplaintController.update);
router.delete('/delete/:_id', GoodsComplaintController.delete);

module.exports = router;
