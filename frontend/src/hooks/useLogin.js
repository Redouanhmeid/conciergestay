import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../services/firebaseConfig';
import { signInWithPopup } from 'firebase/auth';

export const useLogin = () => {
 const [error, setError] = useState(null);
 const [isLoading, setIsLoading] = useState(false);
 const { dispatch } = useAuthContext();
 const navigate = useNavigate();

 const login = async (email, password) => {
  setIsLoading(true);
  setError(null);

  const response = await fetch('/api/v1/propertymanagers/login', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({ email, password }),
  });
  const json = await response.json();

  if (!response.ok) {
   setIsLoading(false);
   setError(json.error);
  }
  if (response.ok) {
   // save the user to local storage
   localStorage.setItem('user', JSON.stringify(json));

   // update the auth context
   dispatch({ type: 'LOGIN', payload: json });

   setIsLoading(false);

   navigate('/');
  }
 };

 const googleLogin = async () => {
  try {
   setIsLoading(true);
   const result = await signInWithPopup(auth, provider);
   const user = result.user;
   // Optionally send user information to your backend if needed
   dispatch({ type: 'LOGIN', payload: user });
   localStorage.setItem('user', JSON.stringify(user));
   setIsLoading(false);
   navigate('/');
  } catch (error) {
   setError(error.message);
   setIsLoading(false);
  }
 };

 return { login, googleLogin, isLoading, error };
};
