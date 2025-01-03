import React, { createContext, useState, useContext, useEffect } from 'react';
import MapConfig from '../mapconfig';

const TranslationContext = createContext();
const GOOGLE_API_KEY = MapConfig.REACT_APP_GOOGLE_MAP_API_KEY;
const API_URL = 'https://translation.googleapis.com/language/translate/v2';

// Translation cache to avoid redundant API calls
const translationCache = new Map();

export const TranslationProvider = ({ children }) => {
 const [currentLanguage, setCurrentLanguage] = useState('fr');
 const [translations, setTranslations] = useState({});
 const [loading, setLoading] = useState(false);

 const translateText = async (text, targetLang) => {
  const cacheKey = `${text}_${targetLang}`;

  if (translationCache.has(cacheKey)) {
   return translationCache.get(cacheKey);
  }

  try {
   const response = await fetch(`${API_URL}?key=${GOOGLE_API_KEY}`, {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify({
     q: text,
     target: targetLang,
    }),
   });

   const data = await response.json();
   const translatedText = data.data.translations[0].translatedText;

   translationCache.set(cacheKey, translatedText);
   return translatedText;
  } catch (error) {
   console.error('Translation error:', error);
   return text;
  }
 };

 const t = async (key, defaultText = key) => {
  if (translations[currentLanguage]?.[key]) {
   return translations[currentLanguage][key];
  }

  try {
   setLoading(true);
   const translatedText = await translateText(defaultText, currentLanguage);

   setTranslations((prev) => ({
    ...prev,
    [currentLanguage]: {
     ...prev[currentLanguage],
     [key]: translatedText,
    },
   }));

   return translatedText;
  } finally {
   setLoading(false);
  }
 };

 return (
  <TranslationContext.Provider
   value={{
    t,
    currentLanguage,
    setLanguage: setCurrentLanguage,
    loading,
   }}
  >
   {children}
  </TranslationContext.Provider>
 );
};

export const useTranslation = () => {
 const context = useContext(TranslationContext);
 if (!context) {
  throw new Error('useTranslation must be used within a TranslationProvider');
 }
 return context;
};
