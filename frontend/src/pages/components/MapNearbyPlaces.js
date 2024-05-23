import React, { useState, useEffect } from 'react';
import { Spin, Space, Image, Typography, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import MapConfig from '../../mapconfig';
import {
 APIProvider,
 Map,
 AdvancedMarker,
 InfoWindow,
} from '@vis.gl/react-google-maps';
import { useJsApiLoader } from '@react-google-maps/api';
import pinIcon from '../../assets/pin.gif';
import { useGoogleMapsLoader } from '../../services/GoogleMapService';
import useNearbyPlaces from '../../hooks/useNearbyPlaces';

// Define libraries as a const variable outside of the component
const libraries = ['places', 'geometry'];
const { Text, Paragraph } = Typography;

const MapNearbyPlaces = React.memo(({ latitude, longitude, type }) => {
 const isLoaded = useGoogleMapsLoader();
 const { data: places = [], loading } = useNearbyPlaces(latitude, longitude);
 const [selectedPlace, setSelectedPlace] = useState(null);
 const [infowindowShown, setInfowindowShown] = useState(false);
 const [filteredPlaces, setFilteredPlaces] = useState([]);

 const center = {
  lat: latitude,
  lng: longitude,
 };
 const toggleInfoWindow = (place) =>
  setSelectedPlace(
   selectedPlace && selectedPlace.id === place.id ? null : place
  );
 const closeInfoWindow = () => {
  setSelectedPlace(null);
  setInfowindowShown(false);
 };
 const display = (url) => {
  window.open(url, '_blank');
 };

 useEffect(() => {
  if (places && type) {
   if (type === 'food') {
    setFilteredPlaces(
     places.filter(
      (place) =>
       place.types.includes('restaurant') || place.types.includes('food')
     )
    );
   } else {
    setFilteredPlaces(places.filter((place) => place.types.includes(type)));
   }
  }
  if (places && !type) {
   setFilteredPlaces(places);
  }
 }, [places, type]);

 if (!isLoaded || loading) {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }
 return (
  <APIProvider>
   <div
    style={{
     display: 'inline-block',
     width: '100%',
     height: '600px',
     borderRadius: '12px',
     overflow: 'hidden',
    }}
   >
    <Map defaultCenter={center} defaultZoom={14} mapId={MapConfig.MAP_ID}>
     {filteredPlaces.map((place) => (
      <AdvancedMarker
       key={place.id}
       position={{ lat: place.latitude, lng: place.longitude }}
       onClick={() => toggleInfoWindow(place)}
      >
       <div className="pin">
        <img src={place.photo} alt={place.name} />
       </div>
      </AdvancedMarker>
     ))}

     {selectedPlace && (
      <InfoWindow
       position={{ lat: selectedPlace.latitude, lng: selectedPlace.longitude }}
       pixelOffset={new window.google.maps.Size(0, -100)}
       onCloseClick={closeInfoWindow}
      >
       <Space>
        <Image width={140} src={selectedPlace.photo} />
        <Space direction="vertical">
         <Text size={20} style={{ color: '#aa7e42', fontWeight: 'bold' }}>
          {selectedPlace.name}
         </Text>
         <Paragraph style={{ width: 180 }}>{selectedPlace.address}</Paragraph>
         <Button
          type="primary"
          shape="round"
          style={{ float: 'right' }}
          icon={<i className="fa-light fa-map-location-dot"></i>}
          onClick={() => display(selectedPlace.url)}
         />
        </Space>
       </Space>
      </InfoWindow>
     )}
    </Map>
   </div>
  </APIProvider>
 );
});

export default MapNearbyPlaces;
