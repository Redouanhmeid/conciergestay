import React, { useState, useEffect } from 'react';
import { Spin, Space, Tag, Typography, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import MapConfig from '../../mapconfig';
import {
 Map,
 AdvancedMarker,
 InfoWindow,
 Pin,
 useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import useGetPropertiesByLatLon from '../../hooks/useGetPropertiesByLatLon';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const MapHome = React.memo(({ isLoaded, city }) => {
 const [center, setCenter] = useState({ lat: 34.0209, lng: -6.8416 });
 const [selectedPlace, setSelectedPlace] = useState(null);
 const { loading, error, data } = useGetPropertiesByLatLon(
  center.lat,
  center.lng
 );

 console.log(selectedPlace);
 const [markerRef, marker] = useAdvancedMarkerRef();
 const [infowindowShown, setInfowindowShown] = useState(false);
 const toggleInfoWindow = (place) => {
  setSelectedPlace(place);
  setInfowindowShown((previousState) => !previousState);
 };
 const closeInfoWindow = () => {
  setSelectedPlace(null);
  setInfowindowShown(false);
 };

 // Set center coordinates based on the city value
 const getCityCoordinates = async (city) => {
  if (!city || !isLoaded || !window.google) return; // Do nothing if city is not provided

  const placesService = new window.google.maps.places.PlacesService(
   document.createElement('div')
  );
  placesService.textSearch({ query: city }, (results, status) => {
   if (
    status === window.google.maps.places.PlacesServiceStatus.OK &&
    results.length > 0
   ) {
    const location = results[0].geometry.location;
    setCenter({ lat: location.lat(), lng: location.lng() });
   } else {
    console.error('Error fetching city coordinates:', status);
   }
  });
 };
 // Set center coordinates when city prop changes
 useEffect(() => {
  if (isLoaded) {
   getCityCoordinates(city);
  }
 }, [city, isLoaded]);

 // Get user's current position
 useEffect(() => {
  if (navigator.geolocation) {
   navigator.geolocation.getCurrentPosition(
    (position) => {
     setCenter({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
     });
    },
    (error) => {
     console.error('Error getting user location:', error);
    }
   );
  } else {
   console.error('Geolocation is not supported by this browser.');
  }
 }, []);

 if (!isLoaded) {
  return (
   <div className="loading">
    <Spin size="large" />
   </div>
  );
 }
 return (
  <div
   style={{
    display: 'inline-block',
    width: '100%',
    height: '520px',
   }}
  >
   <Map
    key={`${center.lat}-${center.lng}`}
    mapId={MapConfig.MAP_ID}
    defaultZoom={13}
    defaultCenter={center}
    onDragend={(mapProps) => {
     // Update center when the map is moved
     if (mapProps && mapProps.center) {
      setCenter({ lat: mapProps.center.lat(), lng: mapProps.center.lng() });
     }
    }}
   >
    {data &&
     data.map((place, index) => (
      <AdvancedMarker
       ref={markerRef}
       key={index}
       position={{ lat: place.latitude, lng: place.longitude }}
       onClick={() => toggleInfoWindow(place)}
      >
       <div className="pin">
        <img src={place.photos[0]} alt={place.name} />
       </div>
      </AdvancedMarker>
     ))}
    {infowindowShown && selectedPlace && (
     <InfoWindow
      style={{ padding: 6 }}
      anchor={marker}
      onCloseClick={closeInfoWindow}
     >
      <Space direction="vertical">
       <Title level={5} style={{ marginTop: 0, marginBottom: 0 }}>
        {selectedPlace.name}
       </Title>
       <Text strong>
        <span style={{ color: '#aa7e42' }}>{selectedPlace.price}</span> Dh /
        Nuit
       </Text>
       <Space wrap>
        <Tag>
         <Text size={18}>{selectedPlace.rooms} Chambres</Text>
        </Tag>
        <Tag>
         <Text size={18}>
          {selectedPlace.capacity} Capacité Personne {selectedPlace.id}
         </Text>
        </Tag>
        <Link
         to={{
          pathname: '/propertydetails',
          state: { id: selectedPlace.id, properties: [] },
         }}
        >
         <Button type="default" shape="round" icon={<RightOutlined />} />
        </Link>
       </Space>
      </Space>
     </InfoWindow>
    )}
   </Map>
  </div>
 );
});

export default MapHome;
