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

   // Check if the user already exists in your backend
   const response = await fetch(`/api/v1/propertymanagers/email/${user.email}`);
   const userData = await response.json();

   if (response.ok && userData) {
    // If user exists, log them in
    dispatch({ type: 'LOGIN', payload: userData });
    localStorage.setItem('user', JSON.stringify(userData));
   } else {
    // If user doesn't exist, sign them up
    const dummyPassword = Math.random().toString(36).slice(-8);

    const newUser = {
     email: user.email,
     password: dummyPassword,
     firstname: user.displayName.split(' ')[0],
     lastname: user.displayName.split(' ').slice(1).join(' '),
     phone: user.phoneNumber || 'N/A',
     avatar: user.photoURL || '/avatars/default.png',
     isVerified: true, // Automatically verified for Google sign-ups
    };

    const signupResponse = await fetch('/api/v1/propertymanagers', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(newUser),
    });

    const newUserData = await signupResponse.json();

    if (signupResponse.ok) {
     dispatch({ type: 'LOGIN', payload: newUserData });
     localStorage.setItem('user', JSON.stringify(newUserData));
    } else {
     throw new Error(newUserData.error || 'Sign-up failed');
    }
   }

   setIsLoading(false);
   navigate('/');
  } catch (error) {
   if (error.code === 'auth/popup-closed-by-user') {
    setError('Vous avez fermé la fenêtre de connexion. Veuillez réessayer.');
   } else {
    setError(error.message);
   }
   setIsLoading(false);
  }
 };

 return { login, googleLogin, isLoading, error };
};
