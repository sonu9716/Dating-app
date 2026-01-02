const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const safetyController = require('../controllers/safetyController');

// All safety routes are protected
router.use(auth);

// Emergency Contacts
router.get('/contacts', safetyController.getEmergencyContacts);
router.post('/contacts', safetyController.addEmergencyContact);
router.delete('/contacts/:id', safetyController.deleteEmergencyContact);

// Live Date Sessions
router.post('/session/start', safetyController.startDateSession);
router.post('/session/end', safetyController.endDateSession);
router.post('/session/checkin', safetyController.checkInSession);

// Emergency Trigger
router.post('/emergency/trigger', safetyController.triggerEmergency);

// Safety Preferences
router.get('/preferences', safetyController.getSafetyPreferences);
router.put('/preferences', safetyController.updateSafetyPreferences);

module.exports = router;
