import { Select } from 'antd';
import { useTranslation } from '../context/TranslationContext';
import languages from './languages';

export const LanguageSelector = () => {
 const { currentLanguage, setLanguage } = useTranslation();

 return (
  <Select
   value={currentLanguage}
   onChange={setLanguage}
   options={languages}
   style={{ width: 120 }}
   dropdownStyle={{ maxHeight: 400 }}
  />
 );
};
