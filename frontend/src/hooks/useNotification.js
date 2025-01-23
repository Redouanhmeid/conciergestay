import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from '../context/TranslationContext';

const useNotification = () => {
 const { t } = useTranslation();
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 const apiBase = '/api/v1/notifications';

 // Get all notifications for a property manager
 const getManagerNotifications = async (propertyManagerId) => {
  setLoading(true);
  try {
   const response = await axios.get(`${apiBase}/manager/${propertyManagerId}`);
   return response.data;
  } catch (error) {
   setError(error);
   return null;
  } finally {
   setLoading(false);
  }
 };

 // Get all notifications for a property
 const getPropertyNotifications = async (propertyId) => {
  setLoading(true);
  try {
   const response = await axios.get(`${apiBase}/property/${propertyId}`);
   return response.data;
  } catch (error) {
   setError(error);
   return null;
  } finally {
   setLoading(false);
  }
 };

 // Create a new notification
 const createNotification = async (notificationData) => {
  setLoading(true);
  try {
   const response = await axios.post(`${apiBase}`, notificationData);
   return response.data;
   console.log(response);
  } catch (error) {
   setError(error);
   return null;
  } finally {
   setLoading(false);
  }
 };

 // Mark notification as read
 const markAsRead = async (notificationId) => {
  setLoading(true);
  try {
   const response = await axios.put(`${apiBase}/${notificationId}/read`);
   return response.data;
  } catch (error) {
   setError(error);
   return null;
  } finally {
   setLoading(false);
  }
 };

 // Get unread notifications count
 const getUnreadCount = async (propertyManagerId) => {
  try {
   const response = await axios.get(`${apiBase}/unread/${propertyManagerId}`);
   return response.data.unreadCount;
  } catch (error) {
   setError(error);
   return 0;
  }
 };

 // Delete a notification
 const deleteNotification = async (notificationId) => {
  setLoading(true);
  try {
   const response = await axios.delete(`${apiBase}/${notificationId}`);
   return response.data;
  } catch (error) {
   setError(error);
   return null;
  } finally {
   setLoading(false);
  }
 };

 // Mark all notifications as read for a manager
 const markAllAsRead = async (propertyManagerId) => {
  setLoading(true);
  try {
   const response = await axios.put(
    `${apiBase}/manager/${propertyManagerId}/read-all`
   );
   return response.data;
  } catch (error) {
   setError(error);
   return null;
  } finally {
   setLoading(false);
  }
 };

 const createPropertyVerificationNotification = async (
  propertyManagerId,
  propertyId,
  propertyName
 ) => {
  return await createNotification({
   propertyManagerId,
   propertyId,
   title: t('notification.messages.createTitle'),
   message: `${t('notification.messages.createMessage1')}${propertyName}${t(
    'notification.messages.createMessage2'
   )}`,
   type: 'property_update',
   channel: 'email',
  });
 };

 // Helper function to create common notifications
 const createPropertyUpdateNotification = async (
  propertyManagerId,
  propertyId,
  title,
  message
 ) => {
  return await createNotification({
   propertyManagerId,
   propertyId,
   title,
   message,
   type: 'property_update',
   channel: 'email',
  });
 };

 const createRevenueUpdateNotification = async (
  propertyManagerId,
  propertyId,
  amount,
  month,
  year
 ) => {
  return await createNotification({
   propertyManagerId,
   propertyId,
   title: t('notification.messages.revenueTitle'),
   message: `${t('notification.messages.revenueMessage1')}${amount}${t(
    'notification.messages.revenueMessage2'
   )}${month}/${year}.`,
   type: 'revenue_update',
   channel: 'email',
  });
 };

 const createTaskUpdateNotification = async (
  propertyManagerId,
  propertyId,
  taskTitle,
  priority
 ) => {
  return await createNotification({
   propertyManagerId,
   propertyId,
   title: 'Nouvelle tâche',
   message: `Une nouvelle tâche "${taskTitle}" (Priorité: ${priority}) a été créée.`,
   type: 'task_update',
   channel: 'email',
  });
 };

 return {
  loading,
  error,
  getManagerNotifications,
  getPropertyNotifications,
  createNotification,
  markAsRead,
  getUnreadCount,
  deleteNotification,
  markAllAsRead,
  // Helper methods for common notifications
  createPropertyVerificationNotification,
  createPropertyUpdateNotification,
  createRevenueUpdateNotification,
  createTaskUpdateNotification,
 };
};

export default useNotification;
