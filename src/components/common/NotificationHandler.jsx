import React, { useEffect } from 'react';
/* import { requestForToken, onMessageListener } from '../../utils/firebase';
import toast from 'react-hot-toast'; */

const NotificationHandler = () => {
  /*  useEffect(() => {
     // Request permission and get token when component mounts
     const initializeNotifications = async () => {
       const token = await requestForToken();
       if (token) {
         // Here you would typically send the token to your backend
         console.log("Token initialized and ready for backend storage");
       }
     };
 
     initializeNotifications();
 
     // Listen for foreground messages
     onMessageListener()
       .then((payload) => {
         console.log("Foreground message received:", payload);
         toast.success(`${payload.notification.title}: ${payload.notification.body}`, {
           duration: 6000,
           position: 'top-right',
         });
       })
       .catch((err) => console.log("Failed to receive foreground message:", err));
   }, []); */

  return null; // This component doesn't render anything UI-wise
};

export default NotificationHandler;
