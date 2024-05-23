import React from 'react';
import { Spin } from 'antd';
import MapConfig from '../../mapconfig';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useJsApiLoader } from '@react-google-maps/api';
import pinIcon from '../../assets/pin.gif';
import { useGoogleMapsLoader } from '../../services/GoogleMapService';

// Define libraries as a const variable outside of the component
const libraries = ['places', 'geometry'];

const MapMarker = React.memo(({ latitude, longitude }) => {
 const isLoaded = useGoogleMapsLoader();

 const center = {
  lat: latitude,
  lng: longitude,
 };

 if (!isLoaded) {
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
     height: '520px',
     borderRadius: '12px',
     overflow: 'hidden',
    }}
   >
    <Map defaultCenter={center} defaultZoom={14} mapId={MapConfig.MAP_ID}>
     <AdvancedMarker position={center}>
      <div
       style={{
        width: '50px',
        height: '50px',
        backgroundImage: `url(${pinIcon})`,
        backgroundSize: 'cover',
        zIndex: 1000,
       }}
      />
     </AdvancedMarker>
    </Map>
   </div>
  </APIProvider>
 );
});

export default MapMarker;
