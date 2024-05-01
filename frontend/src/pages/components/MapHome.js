import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import MapConfig from '../../mapconfig';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useJsApiLoader } from '@react-google-maps/api';
import pinIcon from '../../assets/pin.gif';
import { useGoogleMapsLoader } from '../../services/GoogleMapService';

// Define libraries as a const variable outside of the component
const libraries = ['places', 'geometry'];

const MapHome = ({ city }) => {
 const isLoaded = useGoogleMapsLoader();
 const [center, setCenter] = useState({ lat: 34.0209, lng: -6.8416 });

 const handleCityButtonClick = (city) => {
  // Use a mapping of cities to coordinates here
  const cityCoordinates = {
   Casablanca: { lat: 33.5731, lng: -7.5898 },
   Rabat: { lat: 34.0209, lng: -6.8416 },
   Marrakesh: { lat: 31.6295, lng: -7.9811 },
   // Add other city coordinates here
  };

  if (cityCoordinates[city]) {
   setCenter(cityCoordinates[city]);
  }
 };

 // Set center coordinates based on the city value
 const getCityCoordinates = (city) => {
  if (!city) return; // Do nothing if city is not provided

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
  getCityCoordinates(city);
 }, [city]);

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

 if (isLoaded) {
  return (
   <APIProvider>
    <div
     style={{
      display: 'inline-block',
      width: '100%',
      height: '520px',
     }}
    >
     <Map
      key={`${center.lat}-${center.lng}`}
      defaultZoom={13}
      defaultCenter={center}
      onDragend={(mapProps) => {
       // Update center when the map is moved
       if (mapProps && mapProps.center) {
        setCenter({ lat: mapProps.center.lat(), lng: mapProps.center.lng() });
       }
      }}
     />
    </div>
   </APIProvider>
  );
 }
 return (
  <div className="loading">
   <Spin size="large" />
  </div>
 );
};

export default MapHome;
