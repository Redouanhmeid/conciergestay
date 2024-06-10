import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
 Layout,
 Row,
 Col,
 Card,
 Typography,
 Flex,
 Image,
 QRCode,
 Divider,
 Avatar,
 Button,
} from 'antd';
import Logo from '../../assets/logo.png';
import ClientConfig from '../../ClientConfig';
import MapConfig from '../../mapconfig';
import { useUserData } from '../../hooks/useUserData';
import MapMarker from '../components/MapMarker';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const Print = ({ property, amenities }) => {
 const [isLoaded, setIsLoaded] = useState(false);
 const { userData, getUserDataById } = useUserData();
 const [staticMapUrl, setStaticMapUrl] = useState('');

 const apiKey = MapConfig.REACT_APP_GOOGLE_MAP_API_KEY;

 useEffect(() => {
  if (property.propertyManagerId) {
   getUserDataById(property.propertyManagerId);
  }
 }, [property.propertyManagerId]);

 useEffect(() => {
  if (property.latitude && property.longitude) {
   const url = getStaticMapUrl(property.latitude, property.longitude, apiKey);
   setStaticMapUrl(url);
  }
  setTimeout(() => {
   setIsLoaded(true);
  }, 1000);
 }, [property.latitude, property.longitude]);

 const generatePdf = () => {
  const element = document.getElementById('content');
  html2canvas(element, { useCORS: true, allowTaint: true }).then((canvas) => {
   const imgData = canvas.toDataURL('image/png');
   const pdf = new jsPDF('p', 'mm', 'a4');
   const imgProps = pdf.getImageProperties(imgData);
   const pdfWidth = pdf.internal.pageSize.getWidth();
   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
   pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
   pdf.save(`${property.name}.pdf`);
  });
 };

 return (
  <div>
   <Layout id="content" className="layout">
    <Content style={{ padding: '0 50px' }}>
     <div className="site-layout-content">
      <Row gutter={[16, 16]}>
       <Welcome
        property={property}
        setIsLoaded={setIsLoaded}
        setMapImage={setMapImage}
        staticMapUrl={staticMapUrl}
       />
      </Row>
     </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>
     {property.name} ©2024 Created by ConciergeStay
    </Footer>
   </Layout>
   <Button onClick={generatePdf} disabled={!isLoaded}>
    Download as PDF
   </Button>
  </div>
 );
};

export default Print;

const Welcome = React.memo(
 ({ property, setIsLoaded, setMapImage, staticMapUrl }) => {
  const { userData, getUserDataById } = useUserData();
  useEffect(() => {
   if (property.propertyManagerId) {
    getUserDataById(property.propertyManagerId);
   }
   console.log(userData);
  }, [property.propertyManagerId]);

  return (
   <Col xs={24} md={{ span: 20, offset: 2 }}>
    <Col xs={24}>
     <Flex gap="middle" align="center" justify="space-between">
      <Image className="logoStyle" src={Logo} preview={false} width="200" />
      <Image
       className="dgImg"
       src={property.photos[0]}
       preview={false}
       width={300}
       onLoad={() => setIsLoaded(true)}
      />
      <Flex gap="middle" align="start" vertical>
       <QRCode
        errorLevel="H"
        color="#2b2c32"
        size={180}
        iconSize={64}
        value={`${ClientConfig.URL}/propertydetails?id=${property.id}`}
        icon={Logo}
        onLoad={() => setIsLoaded(true)}
       />
       <Text>
        {property.name}
        <br />
        {userData.email}
       </Text>
      </Flex>
     </Flex>
    </Col>
    <Col xs={24}>
     {staticMapUrl && (
      <Image
       src={staticMapUrl}
       alt="Map"
       style={{
        width: '100%',
        height: '420px',
        borderRadius: '12px',
        overflow: 'hidden',
       }}
      />
     )}
    </Col>
    <Col xs={24}>
     <Divider>
      <Title level={3}>{property.name}</Title>
     </Divider>
     <Title level={4}>Bonjour</Title>
     <Paragraph>{property.description}</Paragraph>
     <Card bordered={false}>
      <Meta
       avatar={
        <Avatar
         size={{ xs: 54, md: 56, lg: 56, xl: 56, xxl: 56 }}
         src={userData.avatar}
        />
       }
       title={`${userData.firstname} ${userData.lastname}`}
       description={
        <>
         <i className="fa-light fa-envelope"></i> {userData.email}
        </>
       }
      />
     </Card>
    </Col>
   </Col>
  );
 }
);
