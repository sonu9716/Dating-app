const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { like, pass, superLike } = require('../controllers/swipeController');

// All swipe routes are protected
router.use(auth);

router.post('/like', like);
router.post('/pass', pass);
router.post('/super-like', superLike);
module.exports = router;
