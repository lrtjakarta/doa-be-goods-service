const express = require('express');
const router = express.Router();
const GoodsRelocationController = require('../controller/GoodsRelocationController');

router.get('/', GoodsRelocationController.getAll);
router.get('/:_id', GoodsRelocationController.getById);
router.post('/add', GoodsRelocationController.add);
router.put('/update/:_id', GoodsRelocationController.update);
router.delete('/delete/:_id', GoodsRelocationController.delete);

module.exports = router;
