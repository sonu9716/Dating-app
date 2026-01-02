const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProfile, updateProfile, getDiscovery, getPreferences, updatePreferences, uploadPhoto, deletePhoto } = require('../controllers/userController');
const upload = require('../middleware/upload');

// Public debug route
router.get('/debug', require('../controllers/userController').debugDiscovery);

// All user routes are protected
router.use(auth);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/discovery', getDiscovery);
router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);
router.post('/photo', upload.single('photo'), uploadPhoto);
router.delete('/photo', deletePhoto);

module.exports = router;
