import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { auth, provider } from '../services/firebaseConfig';
import { signInWithPopup } from 'firebase/auth';

export const useSignup = () => {
 const [error, setError] = useState(null);
 const [message, setMessage] = useState(null);
 const [isLoading, setIsLoading] = useState(false);
 const { dispatch } = useAuthContext();

 const signup = async (email, password, firstname, lastname, phone) => {
  setIsLoading(true);
  setError(null);

  const response = await fetch('/api/v1/propertymanagers', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({ email, password, firstname, lastname, phone }),
  });
  const json = await response.json();

  if (!response.ok) {
   setIsLoading(false);
   setError(json.error);
  }
  if (response.ok) {
   // save the user to local storage
   localStorage.setItem('user', JSON.stringify(json));
   setMessage(json.message);
   // update the auth context
   dispatch({ type: 'LOGIN', payload: json });

   setIsLoading(false);
  }
 };

 const googleSignup = async () => {
  try {
   setIsLoading(true);
   const result = await signInWithPopup(auth, provider);
   const user = result.user;
   // Send user information to your backend if needed
   dispatch({ type: 'LOGIN', payload: user });
   localStorage.setItem('user', JSON.stringify(user));
   setMessage('Google Sign-Up Successful');
   setIsLoading(false);
  } catch (error) {
   setError(error.message);
   setIsLoading(false);
  }
 };

 return { signup, googleSignup, isLoading, error, message };
};
