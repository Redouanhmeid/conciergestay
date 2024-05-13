import React, { useEffect, useState, useCallback } from 'react';
import MapConfig from '../../mapconfig';
import { Spin } from 'antd';
import { LoadScript, useJsApiLoader } from '@react-google-maps/api';
import {
 APIProvider,
 Map,
 AdvancedMarker,
 Pin,
} from '@vis.gl/react-google-maps';
import pinIcon from '../../assets/pin.png';

const MapMarker = ({ latitude, longitude }) => {
 const { isLoaded, loadError } = useJsApiLoader({
  googleMapsApiKey: MapConfig.REACT_APP_GOOGLE_MAP_API_KEY,
 });
 const defaultCenter = {
  lat: latitude,
  lng: longitude,
 };

 const [map, setMap] = useState(null);
 const [places, setPlaces] = useState([]);

 const getIconColor = (types) => {
  if (types.includes('restaurant')) {
   return 'blue'; // Icon color for restaurants
  } else if (types.includes('tourist_attraction')) {
   return 'green'; // Icon color for tourist attractions
  } else if (types.includes('store')) {
   return 'red'; // Icon color for stores
  } else if (types.includes('bar')) {
   return 'purple'; // Icon color for bars
  } else if (types.includes('shopping_mall')) {
   return 'orange'; // Icon color for shopping malls
  } else if (types.includes('brewery')) {
   return 'yellow'; // Icon color for breweries
  } else {
   return 'gray'; // Default icon color
  }
 };

 const onLoad = useCallback(
  function callback(map) {
   if (!map) return; // Ensure map is not null
   const bounds = new window.google.maps.LatLngBounds(defaultCenter);
   map.fitBounds(bounds);
   setMap(map);

   const service = new window.google.maps.places.PlacesService(map);

   service.nearbySearch(
    {
     location: defaultCenter,
     radius: 1000, // 1km radius
     type: [
      'restaurant',
      'tourist_attraction',
      'store',
      'bar',
      'shopping_mall',
      'brewery',
     ], // Types of places to search for
    },
    (results, status) => {
     if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      const formattedResults = results.map((result) => ({
       ...result,
       iconColor: getIconColor(result.types),
      }));
      setPlaces(formattedResults);
     }
    }
   );
  },
  [defaultCenter]
 );

 const onUnmount = useCallback(function callback(map) {
  setMap(null);
 }, []);

 if (loadError) {
  return <div>Error loading Google Maps API</div>;
 }

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
     height: '400px',
    }}
   >
    <Map
     defaultZoom={14}
     defaultCenter={defaultCenter}
     mapId={MapConfig.MAP_ID}
     onLoad={onLoad}
     onUnmount={onUnmount}
    >
     <AdvancedMarker position={defaultCenter}>
      <Pin
       background={'#aa7e42'}
       borderColor={'#2b2c32'}
       glyphColor={'#fbfbfb'}
       scale={1.2}
      />
     </AdvancedMarker>
     {places.map((place, index) => (
      <AdvancedMarker
       key={index}
       position={{
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
       }}
      >
       <Pin
        background={'#ff0000'}
        borderColor={'#000000'}
        glyphColor={'#ffffff'}
       />
      </AdvancedMarker>
     ))}
    </Map>
   </div>
  </APIProvider>
 );
};

export default MapMarker;
