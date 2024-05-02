import React, { useState, useRef } from 'react';
import { Spin, Row, Col, Input, Button, Layout, Flex, Grid } from 'antd';
import Head from '../components/common/header';
import Foot from '../components/common/footer';
import MapHome from './components/MapHome';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Autocomplete } from '@react-google-maps/api';
import { useGoogleMapsLoader } from '../services/GoogleMapService';

const libraries = ['places', 'geometry'];
const { Content } = Layout;
const { useBreakpoint } = Grid;

const Home = () => {
 const isLoaded = useGoogleMapsLoader();
 const screens = useBreakpoint();
 const [searchCity, setSearchCity] = useState('');
 const autocomplete = useRef(null);

 const handleCityChange = (city) => {
  setSearchCity(city);
 };
 const handlePlaceSelect = () => {
  if (autocomplete.current !== null) {
   const place = autocomplete.current.getPlace();
   setSearchCity(place.formatted_address);
  } else {
   console.error('Autocomplete is not loaded yet!');
  }
 };
 if (!isLoaded) {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }
 return (
  <Layout className="contentStyle">
   <Head />
   <Content className="container">
    <Row gutter={[16, 16]}>
     <Col xs={24} sm={24}>
      <APIProvider>
       <Autocomplete
        onLoad={(auto) => {
         autocomplete.current = auto;
        }}
        onPlaceChanged={handlePlaceSelect}
        options={{
         types: ['(cities)'],
         componentRestrictions: { country: 'ma' }, // Restrict search to Morocco
        }}
       >
        <Input
         placeholder="Indiquer une place"
         style={{ width: '100%', padding: '0.5rem' }}
        />
       </Autocomplete>
      </APIProvider>
     </Col>
     <Col xs={24} sm={24}>
      <Flex
       gap="middle"
       justify={screens.xs ? 'start' : 'space-between'}
       wrap="wrap"
      >
       <Button
        size="large"
        onClick={() => handleCityChange('Casablanca, Morocco')}
       >
        Casablanca
       </Button>
       <Button size="large" onClick={() => handleCityChange('Rabat')}>
        Rabat
       </Button>
       <Button size="large" onClick={() => handleCityChange('Marrakesh')}>
        Marrakesh
       </Button>
       <Button size="large" onClick={() => handleCityChange('Agadir')}>
        Agadir
       </Button>
       <Button size="large" onClick={() => handleCityChange('Tangier')}>
        Tangier
       </Button>
       {!screens.xs && (
        <Button size="large" onClick={() => handleCityChange('Fes')}>
         Fes
        </Button>
       )}
       {!screens.xs && (
        <Button size="large" onClick={() => handleCityChange('Bouznika')}>
         Bouznika
        </Button>
       )}
       {!screens.xs && (
        <Button size="large" onClick={() => handleCityChange('Kénitra')}>
         Kénitra
        </Button>
       )}
       {!screens.xs && (
        <Button size="large" onClick={() => handleCityChange('Oujda')}>
         Oujda
        </Button>
       )}
       {!screens.xs && (
        <Button size="large" onClick={() => handleCityChange('Tetouan')}>
         Tetouan
        </Button>
       )}
       {!screens.xs && (
        <Button size="large" onClick={() => handleCityChange('Ouarzazate')}>
         Ouarzazate
        </Button>
       )}
      </Flex>
     </Col>
     <Col xs={24} sm={24}>
      <APIProvider>
       <MapHome city={searchCity} isLoaded={isLoaded} />
      </APIProvider>
     </Col>
    </Row>
   </Content>
   <Foot />
  </Layout>
 );
};

export default Home;
