const express = require('express');
const router = express.Router();
const goodsLoanReturnController = require('../controller/GoodsLoanReturnController');

router.get('/', goodsLoanReturnController.getAll);
router.get('/:_id', goodsLoanReturnController.getById);
router.post('/add', goodsLoanReturnController.add);
router.post('/addMany', goodsLoanReturnController.addMany);
router.put('/update/:_id', goodsLoanReturnController.update);
router.delete('/delete/:_id', goodsLoanReturnController.delete);

module.exports = router;