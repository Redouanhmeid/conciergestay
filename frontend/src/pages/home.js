import React, { useState, useRef } from 'react';
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
import './../App.css';
import PropertyList from './components/PropertyList';

const libraries = ['places', 'geometry'];
const { Content } = Layout;
const { Title, Text } = Typography;

const Home = () => {
 const isLoaded = useGoogleMapsLoader();
 const [searchCity, setSearchCity] = useState('');
 const autocomplete = useRef(null);
 const [viewMode, setViewMode] = useState('list');
 const [openFilter, setOpenFilter] = useState(false);
 const [range, setRange] = useState([300, 600]);
 const [roomValue, setRoomValue] = useState(0);
 const [litValue, setLitValue] = useState(0);
 const [paxValue, setPaxValue] = useState(0);
 const [checkedTypes, setCheckedTypes] = useState([]);
 const [showAllbasicAmenities, setShowAllBasicAmenities] = useState(false);
 const [checkedbasicAmenities, setCheckedbasicAmenities] = useState([]);
 const [showAllUncommonAmenities, setShowAllUncommonAmenities] =
  useState(false);
 const [checkedUncommonAmenities, setCheckedUncommonAmenities] = useState([]);

 const propertyTypes = [
  {
   label: 'Maison',
   value: 'house',
   icon: <i className="checkboxicon fa-light fa-house"></i>,
  },
  {
   label: 'Appartement',
   value: 'apartment',
   icon: <i className="checkboxicon fa-light fa-building"></i>,
  },
  {
   label: "Maison d'hôtes",
   value: 'guesthouse',
   icon: <i className="checkboxicon fa-light fa-house-user"></i>,
  },
 ];
 const basicAmenities = [
  { value: 'kitchen', label: 'Cuisine' },
  { value: 'freeParking', label: 'Parking gratuit' },
  { value: 'wifi', label: 'Wifi' },
  { value: 'airConditioning', label: 'Climatisation' },
  { value: 'television', label: 'Télévision' },
  { value: 'washingMachine', label: 'Lave-linge' },
  { value: 'dedicatedWorkspace', label: 'Espace de travail' },
  { value: 'fitnessEquipements', label: 'Fitness' },
 ];
 const UncommonAmenities = [
  { value: 'pool', label: 'Piscine' },
  { value: 'outdoordining', label: 'Espace repas en plein air' },
  { value: 'fireplace', label: 'Cheminée' },
  { value: 'lakeAccess', label: 'Accès au lac' },
  { value: 'beachAccess', label: 'Accès à la plage' },
  { value: 'skiAccess', label: 'Accessible à skis' },
 ];

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
 const showFilter = () => {
  setOpenFilter(true);
 };
 const onClose = () => {
  setOpenFilter(false);
 };
 const onClear = () => {
  setRange([300, 600]);
  setRoomValue(0);
  setLitValue(0);
  setPaxValue(0);
  setCheckedTypes([]);
  setCheckedbasicAmenities([]);
  setCheckedUncommonAmenities([]);
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
 const onChangeLit = (newValue) => {
  setLitValue(newValue);
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
 const visibleUncommonAmenitie = showAllUncommonAmenities
  ? UncommonAmenities
  : UncommonAmenities.slice(0, 3);

 const toggleShowAllUncommonAmenities = () => {
  setShowAllUncommonAmenities(!showAllUncommonAmenities);
 };
 const handleCheckboxChangeUncommonAmenities = (e, value) => {
  if (e.target.checked) {
   setCheckedUncommonAmenities([...checkedUncommonAmenities, value]);
  } else {
   setCheckedUncommonAmenities(
    checkedUncommonAmenities.filter((item) => item !== value)
   );
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
          placeholder="Indiquer une place"
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
        <Button size="large" onClick={() => handleCityChange('Fes')}>
         Fes
        </Button>
        <Button size="large" onClick={() => handleCityChange('Bouznika')}>
         Bouznika
        </Button>
        <Button size="large" onClick={() => handleCityChange('Kénitra')}>
         Kénitra
        </Button>
        <Button size="large" onClick={() => handleCityChange('Oujda')}>
         Oujda
        </Button>
        <Button size="large" onClick={() => handleCityChange('Tetouan')}>
         Tetouan
        </Button>
        <Button size="large" onClick={() => handleCityChange('Al Hoceima')}>
         Al Hoceima
        </Button>
        <Button size="large" onClick={() => handleCityChange('Ouarzazate')}>
         Ouarzazate
        </Button>
       </div>
      </Col>
      <Col xs={24}>
       {viewMode === 'map' ? (
        <APIProvider>
         <MapHome city={searchCity} isLoaded={isLoaded} />
        </APIProvider>
       ) : (
        <PropertyList
         city={searchCity}
         checkedTypes={checkedTypes}
         range={range}
         roomValue={roomValue}
         litValue={litValue}
         paxValue={paxValue}
         checkedbasicAmenities={checkedbasicAmenities}
         checkedUncommonAmenities={checkedUncommonAmenities}
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
          Afficher la Map <i className="fa-light fa-map-location-dot"></i>
         </>
        }
        unCheckedChildren={
         <>
          Afficher la Liste <i className="fa-light fa-grid-2"></i>
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
    title="Filtres"
    onClose={onClose}
    open={openFilter}
    placement="left"
    size="large"
    extra={
     <Space>
      <Button onClick={onClear}>Tout effacer</Button>
      <Button type="primary" onClick={onClose}>
       Afficher
      </Button>
     </Space>
    }
   >
    <Row gutter={[16, 16]}>
     <Col xs={24}>
      <Title level={4}>Type de propriété</Title>
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
      <Title level={4}>Fourchette de prix</Title>
      <Row align="middle" gutter={16}>
       <Col xs={24}>
        <Slider
         range
         step={100}
         min={0}
         max={2000}
         onChange={onSliderChange}
         value={range}
        />
       </Col>
       <Col xs={11}>
        <InputNumber
         step={100}
         min={0}
         max={2000}
         value={range[0]}
         onChange={onMinChange}
         formatter={(value) =>
          `Min ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
         max={2000}
         value={range[1]}
         formatter={(value) =>
          `Max ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
      <Title level={4}>Chambres, lits et capacité</Title>
      <Col xs={24}>
       <Text>Chambres</Text>
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
           placeholder="Tous"
           variant="filled"
           style={{ width: '100%' }}
           onFocus={() => setRoomValue(1)} // Set a default minimum value when focused
          />
         )}
        </Col>
       </Row>
      </Col>

      <Col xs={24}>
       <Text>Lits</Text>
       <Row gutter={[16, 16]}>
        <Col span={18}>
         <Slider
          min={0}
          max={5}
          onChange={onChangeLit}
          value={typeof litValue === 'number' ? litValue : 0}
         />
        </Col>
        <Col xs={6}>
         {litValue > 0 ? (
          <InputNumber
           min={1}
           max={5}
           value={litValue}
           onChange={onChangeLit}
           style={{ width: '100%' }}
          />
         ) : (
          <InputNumber
           min={0}
           max={5}
           placeholder="Tous"
           variant="filled"
           style={{ width: '100%' }}
           onFocus={() => setLitValue(1)} // Set a default minimum value when focused
          />
         )}
        </Col>
       </Row>
      </Col>

      <Col xs={24}>
       <Text>Max Personnes</Text>
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
           placeholder="Tous"
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
      <Title level={4}>Commodités de base</Title>
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
       {showAllbasicAmenities ? 'Afficher moins' : 'Afficher plus'}
      </Button>
     </Col>

     <Col xs={24}>
      <Title level={4}>Commodités hors du commun</Title>
      <Row gutter={[16, 16]}>
       {visibleUncommonAmenitie.map((item, index) => (
        <Col xs={24} md={8} key={index}>
         <Checkbox
          value={item.value}
          checked={checkedUncommonAmenities.includes(item.value)}
          onChange={(e) => handleCheckboxChangeUncommonAmenities(e, item.value)}
         >
          {item.label}
         </Checkbox>
        </Col>
       ))}
      </Row>
      <Button
       onClick={toggleShowAllUncommonAmenities}
       style={{ marginTop: '20px' }}
      >
       {showAllUncommonAmenities ? 'Afficher moins' : 'Afficher plus'}
      </Button>
     </Col>
    </Row>
   </Drawer>
  </>
 );
};

export default Home;
