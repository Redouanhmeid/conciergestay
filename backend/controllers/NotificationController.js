// controllers/NotificationController.js
const { Notification, PropertyManager, Property } = require('../models');
const nodemailer = require('nodemailer');

// Create transporter for email notifications
const transporter = nodemailer.createTransport({
 host: process.env.SMTP_HOST,
 port: process.env.SMTP_PORT,
 secure: true,
 auth: {
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
 },
});

// Create a new notification
const createNotification = async (req, res) => {
 try {
  const notificationData = req.body;
  const notification = await Notification.createNotification(notificationData);

  // Send email if channel is email
  if (notification.channel === 'email') {
   const propertyManager = await PropertyManager.findByPk(
    notification.propertyManagerId
   );

   if (propertyManager && propertyManager.email) {
    await transporter.sendMail({
     from: process.env.SMTP_FROM,
     to: propertyManager.email,
     subject: notification.title,
     html: notification.message,
    });
   }
  }

  res.status(201).json(notification);
 } catch (error) {
  console.error('Error creating notification:', error);
  res.status(500).json({ error: 'Failed to create notification' });
 }
};

// Get all notifications for a property manager
const getManagerNotifications = async (req, res) => {
 try {
  const { propertyManagerId } = req.params;
  const notifications = await Notification.findAll({
   where: { propertyManagerId },
   order: [['createdAt', 'DESC']],
   include: [
    {
     model: Property,
     as: 'property',
     attributes: ['id', 'name'],
    },
   ],
  });
  res.status(200).json(notifications);
 } catch (error) {
  console.error('Error getting notifications:', error);
  res.status(500).json({ error: 'Failed to get notifications' });
 }
};

// Get all notifications for a specific property
const getPropertyNotifications = async (req, res) => {
 try {
  const { propertyId } = req.params;
  const notifications = await Notification.findAll({
   where: { propertyId },
   order: [['createdAt', 'DESC']],
   include: [
    {
     model: PropertyManager,
     as: 'propertyManager',
     attributes: ['id', 'firstname', 'lastname'],
    },
   ],
  });
  res.status(200).json(notifications);
 } catch (error) {
  console.error('Error getting property notifications:', error);
  res.status(500).json({ error: 'Failed to get property notifications' });
 }
};

// Mark notification as read
const markAsRead = async (req, res) => {
 try {
  const { id } = req.params;
  const notification = await Notification.findByPk(id);

  if (!notification) {
   return res.status(404).json({ error: 'Notification not found' });
  }

  await notification.update({
   read: true,
   readAt: new Date(),
  });

  res.status(200).json(notification);
 } catch (error) {
  console.error('Error marking notification as read:', error);
  res.status(500).json({ error: 'Failed to mark notification as read' });
 }
};

// Delete a notification
const deleteNotification = async (req, res) => {
 try {
  const { id } = req.params;
  const notification = await Notification.findByPk(id);

  if (!notification) {
   return res.status(404).json({ error: 'Notification not found' });
  }

  await notification.destroy();
  res.status(200).json({ message: 'Notification deleted successfully' });
 } catch (error) {
  console.error('Error deleting notification:', error);
  res.status(500).json({ error: 'Failed to delete notification' });
 }
};

// Get unread notifications count for a property manager
const getUnreadCount = async (req, res) => {
 try {
  const { propertyManagerId } = req.params;
  const count = await Notification.count({
   where: {
    propertyManagerId,
    read: false,
   },
  });
  res.status(200).json({ unreadCount: count });
 } catch (error) {
  console.error('Error getting unread count:', error);
  res.status(500).json({ error: 'Failed to get unread notifications count' });
 }
};

// Bulk mark notifications as read
const bulkMarkAsRead = async (req, res) => {
 try {
  const { propertyManagerId } = req.params;
  await Notification.update(
   {
    read: true,
    readAt: new Date(),
   },
   {
    where: {
     propertyManagerId,
     read: false,
    },
   }
  );
  res.status(200).json({ message: 'All notifications marked as read' });
 } catch (error) {
  console.error('Error bulk marking notifications as read:', error);
  res.status(500).json({ error: 'Failed to mark notifications as read' });
 }
};

module.exports = {
 createNotification,
 getManagerNotifications,
 getPropertyNotifications,
 markAsRead,
 deleteNotification,
 getUnreadCount,
 bulkMarkAsRead,
};
