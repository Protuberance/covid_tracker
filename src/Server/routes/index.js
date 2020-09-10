const express = require('express');
const router = express.Router();
const regions = require('../regions');
const getCountryStatistic = require('./reports_country_routes');
const getTotalStatistic = require('./reports_total_routes');
const getAllStatistic = require('./reports_all_routes');
const getTopStatistic = require('./reports_top_routes');


router.get('/regions', (req, res) => {
    res.send(JSON.stringify(regions));
});

router.get('/reports/country', getCountryStatistic);
router.get('/reports/total', getTotalStatistic);
router.get('/reports/all', getAllStatistic);
router.get('/reports/top', getTopStatistic);

module.exports = router;