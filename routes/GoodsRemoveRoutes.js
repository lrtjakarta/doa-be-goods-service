const express = require('express');
const router = express.Router();
const goodsRemoveController = require('../controller/GoodsRemoveController');

router.get('/', goodsRemoveController.getAll);
router.get('/:_id', goodsRemoveController.getById);
router.post('/add', goodsRemoveController.add);
router.post('/addMany', goodsRemoveController.addMany);
router.put('/update/:_id', goodsRemoveController.update);
router.put('/updateMany', goodsRemoveController.updateManyData);
router.delete('/delete/:_id', goodsRemoveController.delete);

module.exports = router;
