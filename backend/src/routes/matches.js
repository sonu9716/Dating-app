const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const matchController = require('../controllers/matchController');

router.use(auth);

router.get('/', matchController.getMatches);
router.get('/:matchId', matchController.getMatch);
router.delete('/:matchId', matchController.unmatch);

module.exports = router;
