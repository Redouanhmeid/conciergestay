import React, { useState, useEffect, useRef } from 'react';
import {
 Spin,
 Row,
 Col,
 Input,
 Button,
 Layout,
 Switch,
 Drawer,
 Checkbox,
 Typography,
 Slider,
 InputNumber,
 Space,
} from 'antd';
import { MinusOutlined } from '@ant-design/icons';
import Head from '../components/common/header';
import Foot from '../components/common/footer';
import MapHome from './components/MapHome';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Autocomplete } from '@react-google-maps/api';
import { useGoogleMapsLoader } from '../services/GoogleMapService';
import { getLocationForCityOrUser } from '../utils/utils';
import { useTranslation } from '../context/TranslationContext';
import './../App.css';
import PropertyList from './components/PropertyList';

const libraries = ['places', 'geometry'];
const { Content } = Layout;
const { Title, Text } = Typography;

const Home = () => {
 const { t } = useTranslation();
 const isLoaded = useGoogleMapsLoader();
 const [searchCity, setSearchCity] = useState('');
 const autocomplete = useRef(null);
 const [viewMode, setViewMode] = useState('list');
 const [openFilter, setOpenFilter] = useState(false);
 const [range, setRange] = useState([0, 10000]);
 const [roomValue, setRoomValue] = useState(0);
 const [paxValue, setPaxValue] = useState(0);
 const [checkedTypes, setCheckedTypes] = useState([]);
 const [showAllbasicAmenities, setShowAllBasicAmenities] = useState(false);
 const [checkedbasicAmenities, setCheckedbasicAmenities] = useState([]);

 const [mapCenter, setMapCenter] = useState(null); // Track map center

 const propertyTypes = [
  {
   label: t('type.house'),
   value: 'house',
   icon: <i className="checkboxicon fa-light fa-house"></i>,
  },
  {
   label: t('type.apartment'),
   value: 'apartment',
   icon: <i className="checkboxicon fa-light fa-building"></i>,
  },
  {
   label: t('type.guesthouse'),
   value: 'guesthouse',
   icon: <i className="checkboxicon fa-light fa-house-user"></i>,
  },
 ];
 const basicAmenities = [
  { value: 'kitchen', label: t('amenity.categories.kitchen') },
  { value: 'freeParking', label: t('amenity.freeParking') },
  { value: 'wifi', label: t('amenity.wifi') },
  { value: 'airConditioning', label: t('amenity.airConditioning') },
  { value: 'television', label: t('amenity.television') },
  { value: 'washingMachine', label: t('amenity.washingMachine') },
  { value: 'pool', label: t('amenity.pool') },
 ];

 useEffect(() => {
  const fetchLocation = async () => {
   const location = await getLocationForCityOrUser(searchCity); // Get the center location
   if (location) {
    setMapCenter(location);
   } else {
    setMapCenter({ lat: 34.0209, lng: -6.8416 });
   }
  };

  fetchLocation();
 }, [searchCity]);

 const handleCityChange = (city) => {
  setSearchCity(city || '');
 };
 const handlePlaceSelect = () => {
  if (autocomplete.current !== null) {
   const place = autocomplete.current.getPlace();
   setSearchCity(place.formatted_address);
  } else {
   console.error('Autocomplete is not loaded yet!');
  }
 };
 const showFilter = () => {
  setOpenFilter(true);
 };
 const onClose = () => {
  setOpenFilter(false);
 };
 const onClear = () => {
  setRange([0, 10000]);
  setRoomValue(0);
  setPaxValue(0);
  setCheckedTypes([]);
  setCheckedbasicAmenities([]);
 };
 const onSliderChange = (newRange) => {
  setRange(newRange);
 };
 const onMinChange = (value) => {
  setRange([value, range[1]]);
 };
 const onMaxChange = (value) => {
  setRange([range[0], value]);
 };
 const onChangeRoom = (newValue) => {
  setRoomValue(newValue);
 };
 const onChangePax = (newValue) => {
  setPaxValue(newValue);
 };
 const handleCheckboxChange = (checkedValues) => {
  setCheckedTypes(checkedValues);
 };

 const visiblebasicAmenitie = showAllbasicAmenities
  ? basicAmenities
  : basicAmenities.slice(0, 6);

 const toggleShowAllbasicAmenities = () => {
  setShowAllBasicAmenities(!showAllbasicAmenities);
 };
 const handleCheckboxChangebasicAmenities = (e, value) => {
  if (e.target.checked) {
   setCheckedbasicAmenities([...checkedbasicAmenities, value]);
  } else {
   setCheckedbasicAmenities(
    checkedbasicAmenities.filter((item) => item !== value)
   );
  }
 };

 if (!isLoaded || !mapCenter) {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }
 return (
  <>
   <Layout className="contentStyle">
    <Head />
    <Content className="container">
     <Row gutter={[16, 16]}>
      <Col xs={searchCity.trim() ? 20 : 24} md={searchCity.trim() ? 23 : 24}>
       <APIProvider>
        <Autocomplete
         onLoad={(auto) => {
          autocomplete.current = auto;
         }}
         onPlaceChanged={handlePlaceSelect}
         options={{
          componentRestrictions: { country: 'ma' }, // Restrict search to Morocco
         }}
        >
         <Input
          placeholder={t('home.searchPlaceholder')}
          style={{ width: '100%', padding: '0.5rem' }}
         />
        </Autocomplete>
       </APIProvider>
      </Col>
      {searchCity.trim() && (
       <Col xs={4} md={1}>
        <Button
         size="large"
         icon={<i className="fa-light fa-bars-filter"></i>}
         onClick={showFilter}
        />
       </Col>
      )}
      <Col xs={24} sm={24}>
       <div className="horizontal-scroll-container">
        <Button
         size="large"
         onClick={() => handleCityChange('Casablanca, Morocco')}
        >
         Casablanca
        </Button>
        <Button size="large" onClick={() => handleCityChange('Rabat, Morocco')}>
         Rabat
        </Button>
        <Button
         size="large"
         onClick={() => handleCityChange('Marrakesh, Morocco')}
        >
         Marrakesh
        </Button>
        <Button
         size="large"
         onClick={() => handleCityChange('Agadir, Morocco')}
        >
         Agadir
        </Button>
        <Button
         size="large"
         onClick={() => handleCityChange('Tangier, Morocco')}
        >
         Tangier
        </Button>
        <Button size="large" onClick={() => handleCityChange('Fes, Morocco')}>
         Fes
        </Button>
        <Button
         size="large"
         onClick={() => handleCityChange('Bouznika, Morocco')}
        >
         Bouznika
        </Button>
        <Button
         size="large"
         onClick={() => handleCityChange('Kénitra, Morocco')}
        >
         Kénitra
        </Button>
        <Button size="large" onClick={() => handleCityChange('Oujda, Morocco')}>
         Oujda
        </Button>
        <Button
         size="large"
         onClick={() => handleCityChange('Tetouan, Morocco')}
        >
         Tetouan
        </Button>
        <Button
         size="large"
         onClick={() => handleCityChange('Al Hoceima, Morocco')}
        >
         Al Hoceima
        </Button>
        <Button
         size="large"
         onClick={() => handleCityChange('Ouarzazate, Morocco')}
        >
         Ouarzazate
        </Button>
       </div>
      </Col>
      <Col xs={24}>
       {viewMode === 'map' ? (
        <APIProvider>
         <MapHome
          isLoaded={isLoaded}
          city={searchCity}
          checkedTypes={checkedTypes}
          range={range}
          roomValue={roomValue}
          paxValue={paxValue}
          checkedbasicAmenities={checkedbasicAmenities}
         />
        </APIProvider>
       ) : (
        <PropertyList
         city={searchCity}
         mapCenter={mapCenter}
         checkedTypes={checkedTypes}
         range={range}
         roomValue={roomValue}
         paxValue={paxValue}
         checkedbasicAmenities={checkedbasicAmenities}
        />
       )}
      </Col>
     </Row>
     <br />
     <Row justify="center">
      <Col xs={14} md={4}>
       <Switch
        checkedChildren={
         <>
          {t('home.showMap')} <i className="fa-light fa-map-location-dot"></i>
         </>
        }
        unCheckedChildren={
         <>
          {t('home.showList')} <i className="fa-light fa-grid-2"></i>
         </>
        }
        checked={viewMode === 'list'}
        onChange={(checked) => setViewMode(checked ? 'list' : 'map')}
        size="large"
        className="custom-switch"
       />
      </Col>
     </Row>
    </Content>
    <Foot />
   </Layout>
   <Drawer
    title={t('home.filters.title')}
    onClose={onClose}
    open={openFilter}
    placement="left"
    size="large"
    extra={
     <Space>
      <Button onClick={onClear}>{t('home.filters.clearAll')}</Button>
      <Button type="primary" onClick={onClose}>
       {t('home.filters.show')}
      </Button>
     </Space>
    }
   >
    <Row gutter={[16, 16]}>
     <Col xs={24}>
      <Title level={4}>{t('home.filters.propertyType')}</Title>
      <Checkbox.Group
       value={checkedTypes}
       onChange={handleCheckboxChange}
       style={{ width: '100%' }}
      >
       {propertyTypes.map((PropertyType) => (
        <div className="customCheckboxContainer" key={PropertyType.value}>
         <Checkbox value={PropertyType.value}>
          <div
           className={
            checkedTypes.includes(PropertyType.value)
             ? 'customCheckboxButton customCheckboxChecked'
             : 'customCheckboxButton'
           }
          >
           {PropertyType.icon}
           <div>{PropertyType.label}</div>
          </div>
         </Checkbox>
        </div>
       ))}
      </Checkbox.Group>
     </Col>

     <Col xs={24}>
      <Title level={4}>{t('home.filters.priceRange')}</Title>
      <Row align="middle" gutter={16}>
       <Col xs={24}>
        <Slider
         range
         step={100}
         min={0}
         max={10000}
         onChange={onSliderChange}
         value={range}
        />
       </Col>
       <Col xs={11}>
        <InputNumber
         step={100}
         min={0}
         max={10000}
         value={range[0]}
         onChange={onMinChange}
         formatter={(value) =>
          `${t('home.filters.min')} ${value}`.replace(
           /\B(?=(\d{3})+(?!\d))/g,
           ','
          )
         }
         size="large"
         style={{ width: '100%' }}
        />
       </Col>
       <Col xs={2}>
        <MinusOutlined />
       </Col>
       <Col xs={11}>
        <InputNumber
         step={100}
         min={0}
         max={10000}
         value={range[1]}
         formatter={(value) =>
          `${t('home.filters.max')} ${value}`.replace(
           /\B(?=(\d{3})+(?!\d))/g,
           ','
          )
         }
         parser={(value) => value.replace(/Maximum\s?|(,*)/g, '')}
         onChange={onMaxChange}
         size="large"
         style={{ width: '100%' }}
        />
       </Col>
      </Row>
     </Col>

     <Col xs={24}>
      <Title level={4}>{t('home.filters.roomsAndCapacity')}</Title>
      <Col xs={24}>
       <Text>{t('home.filters.rooms')}</Text>
       <Row gutter={[16, 16]}>
        <Col span={18}>
         <Slider
          min={0}
          max={5}
          onChange={onChangeRoom}
          value={typeof roomValue === 'number' ? roomValue : 0}
         />
        </Col>
        <Col xs={6}>
         {roomValue > 0 ? (
          <InputNumber
           min={1}
           max={5}
           value={roomValue}
           onChange={onChangeRoom}
           style={{ width: '100%' }}
          />
         ) : (
          <InputNumber
           min={0}
           max={5}
           placeholder={t('home.filters.all')}
           variant="filled"
           style={{ width: '100%' }}
           onFocus={() => setRoomValue(1)} // Set a default minimum value when focused
          />
         )}
        </Col>
       </Row>
      </Col>

      <Col xs={24}>
       <Text>
        <Text>{t('home.filters.maxPeople')}</Text>
       </Text>
       <Row gutter={[16, 16]}>
        <Col span={18}>
         <Slider
          min={0}
          max={5}
          onChange={onChangePax}
          value={typeof paxValue === 'number' ? paxValue : 0}
         />
        </Col>
        <Col xs={6}>
         {paxValue > 0 ? (
          <InputNumber
           min={1}
           max={5}
           value={paxValue}
           onChange={onChangePax}
           style={{ width: '100%' }}
          />
         ) : (
          <InputNumber
           min={0}
           max={5}
           placeholder={t('home.filters.all')}
           variant="filled"
           style={{ width: '100%' }}
           onFocus={() => setPaxValue(1)} // Set a default minimum value when focused
          />
         )}
        </Col>
       </Row>
      </Col>
     </Col>

     <Col xs={24}>
      <Title level={4}>{t('home.filters.basicAmenities')}</Title>
      <Row gutter={[16, 16]}>
       {visiblebasicAmenitie.map((item, index) => (
        <Col xs={12} md={8} key={index}>
         <Checkbox
          value={item.value}
          checked={checkedbasicAmenities.includes(item.value)}
          onChange={(e) => handleCheckboxChangebasicAmenities(e, item.value)}
         >
          {item.label}
         </Checkbox>
        </Col>
       ))}
      </Row>
      <Button
       onClick={toggleShowAllbasicAmenities}
       style={{ marginTop: '20px' }}
      >
       {showAllbasicAmenities
        ? t('home.filters.showLess')
        : t('home.filters.showMore')}
      </Button>
     </Col>
    </Row>
   </Drawer>
  </>
 );
};

export default Home;
