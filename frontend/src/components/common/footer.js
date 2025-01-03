import React, { useState, useEffect } from 'react';
import { Layout, Typography } from 'antd';
import { useTranslation } from '../../context/TranslationContext';

const { Text } = Typography;
const { Footer } = Layout;

const Foot = () => {
 const { t } = useTranslation();
 const [copyright, setCopyright] = useState('');
 useEffect(() => {
  async function loadTranslation() {
   const text = await t('footer.copyright', 'Tous droits réservés');
   setCopyright(text);
  }
  loadTranslation();
 }, [t]);

 return (
  <Footer className="footerStyle">
   <Text type="secondary">
    ConciergeStay ©{new Date().getFullYear()} | {copyright}
   </Text>
  </Footer>
 );
};

export default Foot;
