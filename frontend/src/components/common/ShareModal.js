import React, { useState } from 'react';
import { Modal, Grid, Flex, Divider, QRCode } from 'antd';

const { useBreakpoint } = Grid;

const ShareModal = ({ isVisible, onClose, pageUrl }) => {
 const [qrValue] = useState(pageUrl);
 const screens = useBreakpoint();

 const shareOnWhatsApp = () => {
  const whatsappUrl = screens.xs
   ? `whatsapp://send?text=${encodeURIComponent(pageUrl)}`
   : `https://api.whatsapp.com/send?text=${encodeURIComponent(pageUrl)}`;
  window.open(whatsappUrl, '_blank');
 };

 const shareOnMessenger = () => {
  const messengerUrl = screens.xs
   ? `fb-messenger://share/?link=${encodeURIComponent(pageUrl)}`
   : `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
      pageUrl
     )}&app_id=YOUR_FACEBOOK_APP_ID`;
  window.open(messengerUrl, '_blank');
 };

 const shareOnInstagram = () => {
  if (screens.xs) {
   window.open(
    `instagram://share?text=${encodeURIComponent(pageUrl)}`,
    '_blank'
   );
  } else {
   navigator.clipboard.writeText(pageUrl).then(() => {
    alert(
     'Lien copié dans le presse-papiers. Vous pouvez désormais le coller sur Instagram.'
    );
   });
  }
 };

 const shareOnGmail = () => {
  const subject = encodeURIComponent('Découvrez ce guide digital');
  const body = encodeURIComponent(
   `Je pense que vous pourriez être intéressé par ce guide digital: ${pageUrl}`
  );
  const gmailUrl = screens.xs
   ? `googlegmail://compose?subject=${subject}&body=${body}`
   : `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=${subject}&body=${body}`;
  window.open(gmailUrl, '_blank');
 };

 const shareOnX = () => {
  const text = encodeURIComponent('Check out this Digital Guidebook!');
  const xUrl = screens.xs
   ? `twitter://post?text=${text}&url=${encodeURIComponent(pageUrl)}`
   : `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(
      pageUrl
     )}`;
  window.open(xUrl, '_blank');
 };

 return (
  <Modal
   title="Partager cette page"
   open={isVisible}
   onCancel={onClose}
   footer={null}
  >
   <Flex vertical align="center">
    <QRCode value={qrValue} size={200} />
    <Divider>Ou partager via</Divider>
    <br />
    <Flex gap="middle">
     <i
      className="fa-light fa-brands fa-whatsapp fa-2xl"
      onClick={shareOnWhatsApp}
      style={{ cursor: 'pointer' }}
     />
     <i
      className="fa-brands fa-facebook-messenger fa-2xl"
      onClick={shareOnMessenger}
      style={{ cursor: 'pointer' }}
     />

     <i
      className="fa-light fa-brands fa-instagram fa-2xl"
      onClick={shareOnInstagram}
      style={{ cursor: 'pointer' }}
     />
     <i
      className="fa-light fa-envelope fa-2xl"
      onClick={shareOnGmail}
      style={{ cursor: 'pointer' }}
     />
     <i
      className="fa-light fa-brands fa-x-twitter fa-2xl"
      onClick={shareOnX}
      style={{ cursor: 'pointer' }}
     />
    </Flex>
    <br />
   </Flex>
  </Modal>
 );
};

export default ShareModal;
