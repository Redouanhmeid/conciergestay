import { Space } from 'antd';
import {
 FR,
 US,
 ES,
 DE,
 IT,
 PT,
 RU,
 CN,
 JP,
 KR,
} from 'country-flag-icons/react/3x2';

const flagStyle = {
 width: 16,
 height: 13,
 position: 'relative',
 top: 2,
};

const createOption = (value, label, FlagComponent) => ({
 value,
 label: (
  <Space>
   <FlagComponent style={flagStyle} />
   {label}
  </Space>
 ),
});

const languages = [
 createOption('fr', 'Français', FR),
 createOption('en', 'English', US),
 /* createOption('es', 'Español', ES),
 createOption('de', 'Deutsch', DE),
 createOption('it', 'Italiano', IT),
 createOption('pt', 'Português', PT),
 createOption('ru', 'Русский', RU),
 createOption('zh', '中文', CN),
 createOption('ja', '日本語', JP),
 createOption('ko', '한국어', KR), */
];

export default languages;
