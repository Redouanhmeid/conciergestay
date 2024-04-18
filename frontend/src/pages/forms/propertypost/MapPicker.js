import React, { useState, useRef } from 'react';
import MapConfig from '../../../mapconfig';
import {
 APIProvider,
 Map,
 AdvancedMarker,
 Pin,
 InfoWindow,
} from '@vis.gl/react-google-maps';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

const MapPicker = ({ onPlaceSelected }) => {
 const [position, setPosition] = useState({ lat: 34.0083637, lng: -6.8538748 });
 const [placeName, setPlaceName] = useState();
 const [placeURL, setPlaceURL] = useState();
 const [placeAddress, setPlaceAddress] = useState();
 const [placeRating, setPlaceRating] = useState();
 const [placePhoto, setPlacePhoto] = useState();
 const [placeTypes, setPlaceTypes] = useState();
 const [open, setOpen] = useState(false);
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
  }
 };

 const handleMarkerDragEnd = ({ latLng }) => {
  if (typeof onPlaceSelected === 'function') {
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

 return (
  <LoadScript
   googleMapsApiKey={MapConfig.REACT_APP_GOOGLE_MAP_API_KEY}
   libraries={libraries}
   loading="lazy"
  >
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
       onClick={() => setOpen(true)}
       onDragEnd={({ latLng }) => handleMarkerDragEnd({ latLng })}
       draggable
      >
       <Pin
        background={'#aa7e42'}
        borderColor={'#2b2c32'}
        glyphColor={'#fbfbfb'}
       />
      </AdvancedMarker>

      {open && (
       <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
        <p>I'm in Rabat</p>
       </InfoWindow>
      )}
     </Map>
    </div>
   </APIProvider>
  </LoadScript>
 );
};

export default MapPicker;
