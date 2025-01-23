// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const {
 createNotification,
 getManagerNotifications,
 getPropertyNotifications,
 markAsRead,
 deleteNotification,
 getUnreadCount,
 bulkMarkAsRead,
} = require('../controllers/NotificationController');

// Create a new notification
router.post('/', createNotification);
// Get all notifications for a property manager
router.get('/manager/:propertyManagerId', getManagerNotifications);
// Get all notifications for a property
router.get('/property/:propertyId', getPropertyNotifications);
// Mark a notification as read
router.put('/:id/read', markAsRead);
// Delete a notification
router.delete('/:id', deleteNotification);
// Get unread notifications count
router.get('/unread/:propertyManagerId', getUnreadCount);
// Mark all notifications as read for a manager
router.put('/manager/:propertyManagerId/read-all', bulkMarkAsRead);

module.exports = router;
