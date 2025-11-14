const express = require('express');
const router = express.Router();
const Dashboard = require('../controller/Dashboard');

router.get('/', Dashboard.getDashboard);
router.get('/count/lostfound', Dashboard.getlostFoundData);
router.get('/count/complaint', Dashboard.getComplaintData);
router.get('/count/combined', Dashboard.getCombinedData);
router.get('/count/lostFoundExpired', Dashboard.getLostFoundExpired);

module.exports = router;
