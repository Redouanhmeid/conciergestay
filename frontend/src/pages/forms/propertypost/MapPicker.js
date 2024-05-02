import React, { useState, useRef } from 'react';
import MapConfig from '../../../mapconfig';
import { Spin } from 'antd';
import {
 APIProvider,
 Map,
 AdvancedMarker,
 Pin,
} from '@vis.gl/react-google-maps';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { useGoogleMapsLoader } from '../../../services/GoogleMapService';

const libraries = ['places'];

const MapPicker = React.memo(({ onPlaceSelected }) => {
 const isLoaded = useGoogleMapsLoader();

 const [position, setPosition] = useState({ lat: 34.0083637, lng: -6.8538748 });

 const [placeName, setPlaceName] = useState('');
 const [placeURL, setPlaceURL] = useState('');
 const [placeAddress, setPlaceAddress] = useState('');
 const [placeRating, setPlaceRating] = useState(0);
 const [placePhoto, setPlacePhoto] = useState('');
 const [placeTypes, setPlaceTypes] = useState([]);

 const [markerKey, setMarkerKey] = useState(0);
 const autocompleteRef = useRef(null);

 const handlePlaceSelect = (place) => {
  if (place && place.geometry && place.geometry.location) {
   setPosition({
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng(),
   });
   setMarkerKey(markerKey + 1); // Trigger re-render
   setPlaceName(place.name); // Extract the place name
   setPlaceURL(place.url);
   setPlaceAddress(place.formatted_address);
   setPlaceRating(place.rating);
   setPlacePhoto(place.photos[0]?.getUrl());
   setPlaceTypes(place.types);
   const selectedPlace = {
    latitude: place.geometry.location.lat() || null,
    longitude: place.geometry.location.lng() || null,
    placeName: place.name || null,
    placeURL: place.url || null,
    placeAddress: place.formatted_address || null,
    placeRating: place.rating || null,
    placePhoto: place.photos[0]?.getUrl() || null,
    placeTypes: place.types || null,
   };
   onPlaceSelected(selectedPlace);
  }
 };

 const handleMarkerDragEnd = ({ latLng }) => {
  if (typeof onPlaceSelected === 'function') {
   setPlaceName('');
   setPlaceURL('');
   setPlaceAddress('');
   setPlaceRating(0);
   setPlacePhoto('');
   setPlaceTypes([]);
   onPlaceSelected({
    latitude: latLng.lat() || null,
    longitude: latLng.lng() || null,
    placeName: placeName,
    placeURL: placeURL,
    placeAddress: placeAddress,
    placeRating: placeRating,
    placePhoto: placePhoto,
    placeTypes: placeTypes,
   });
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
  <APIProvider>
   <div
    style={{
     display: 'inline-block',
     width: '100%',
     height: '400px',
    }}
   >
    <Autocomplete
     onLoad={(autocomplete) => {
      autocompleteRef.current = autocomplete;
     }}
     onPlaceChanged={() => {
      if (autocompleteRef.current !== null) {
       const place = autocompleteRef.current.getPlace();
       handlePlaceSelect(place);
      }
     }}
     options={{
      types: ['(cities)'],
      componentRestrictions: { country: 'ma' }, // Restrict search to Morocco
     }}
    >
     <input
      placeholder="Indiquer une place"
      style={{ width: '100%', padding: '0.5rem' }}
     />
    </Autocomplete>
    <Map
     key={markerKey}
     defaultZoom={14}
     defaultCenter={position}
     mapId={MapConfig.MAP_ID}
    >
     <AdvancedMarker
      position={position}
      onDragEnd={({ latLng }) => handleMarkerDragEnd({ latLng })}
      draggable
     >
      <Pin
       background={'#aa7e42'}
       borderColor={'#2b2c32'}
       glyphColor={'#fbfbfb'}
      />
     </AdvancedMarker>
    </Map>
   </div>
  </APIProvider>
 );
});

export default MapPicker;
