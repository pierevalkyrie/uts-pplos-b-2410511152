const express = require('express');
const router = express.Router();
const RequestController = require('../controllers/RequestController');
const verifyToken = require('../middlewares/jwtMiddleware');

router.post('/', verifyToken, RequestController.createRequest);
router.get('/', verifyToken, RequestController.getRequests);

module.exports = router;