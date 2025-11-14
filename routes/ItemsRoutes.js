const express = require('express');
const router = express.Router();
const itemsController = require('../controller/ItemsController');

router.get('/', itemsController.getAll);
router.get('/:_id', itemsController.getById);
router.post('/add', itemsController.add);
router.post('/addMany', itemsController.addMany);
router.put('/update/:_id', itemsController.update);
router.delete('/delete/:_id', itemsController.delete);

module.exports = router;
