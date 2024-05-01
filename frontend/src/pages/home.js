import React, { useState, useRef } from 'react';
import { Row, Col, Input, Button, Layout, Flex, Grid } from 'antd';
import Head from '../components/common/header';
import Foot from '../components/common/footer';
import MapHome from './components/MapHome';

const { Search } = Input;
const { Content } = Layout;
const { useBreakpoint } = Grid;

const Home = () => {
 const screens = useBreakpoint();
 const [searchCity, setSearchCity] = useState('');
 const autoCompleteRef = useRef(null);
 const handleCityChange = (city) => {
  setSearchCity(city);
 };
 const handleSearch = (value) => {
  setSearchCity(value);
 };

 return (
  <Layout className="contentStyle">
   <Head />
   <Content className="container">
    <Row gutter={[16, 16]}>
     <Col xs={24} sm={24}>
      <Search
       ref={autoCompleteRef}
       placeholder="Rechercher"
       size="large"
       onSearch={(value) => handleCityChange(value)}
       enterButton
       allowClear
      />
     </Col>
     <Col xs={24} sm={24}>
      <Flex
       gap="middle"
       justify={screens.xs ? 'start' : 'space-between'}
       wrap="wrap"
      >
       <Button size="large" onClick={() => handleCityChange('Casablanca')}>
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
      <MapHome city={searchCity} />
     </Col>
    </Row>
   </Content>
   <Foot />
  </Layout>
 );
};

export default Home;
