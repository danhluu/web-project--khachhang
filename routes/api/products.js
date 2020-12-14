const express = require('express');
const router = express.Router();

const fetchPageController = require('../../controllers/api/fetch-page-api');
router.get('/fetch-page',fetchPageController.fetchData);
router.get('/get-page-info',fetchPageController.getPageInfo);

module.exports = router;