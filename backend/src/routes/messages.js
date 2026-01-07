const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const messageController = require('../controllers/messageController');

const upload = require('../middleware/upload');

router.use(auth);

router.get('/:matchId', messageController.getMessages);
router.post('/:matchId', messageController.sendMessage);
router.post('/:matchId/media', upload.single('media'), messageController.uploadMedia);
router.put('/:matchId/read', messageController.markAsRead);

module.exports = router;
