import React, { useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { Spin, Card, Carousel } from 'antd';
import MapConfig from '../../mapconfig';
import {
 APIProvider,
 Map,
 AdvancedMarker,
 Pin,
} from '@vis.gl/react-google-maps';
import pinIcon from '../../assets/pin.gif';
// Define libraries as a const variable outside of the component
const libraries = ['places', 'geometry'];
const MapMarker0 = ({ latitude, longitude }) => {
 const { isLoaded } = useJsApiLoader({
  id: MapConfig.MAP_ID,
  googleMapsApiKey: MapConfig.REACT_APP_GOOGLE_MAP_API_KEY,
  libraries: libraries,
 });
 const [places, setPlaces] = useState([]);

 const center = {
  lat: latitude,
  lng: longitude,
 };

 useEffect(() => {
  if (isLoaded) {
   const service = new window.google.maps.places.PlacesService(
    document.createElement('div')
   );
   const request = {
    location: center,
    radius: '2000',
    type: [
     'restaurant',
     'bar',
     'tourist_attraction',
     'shopping_mall',
     'store',
     'park',
    ],
    // Exclude hotels
    exclude: ['lodging'],
   };

   service.nearbySearch(request, (results, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
     Promise.all(
      results.map(
       (place) =>
        new Promise((resolve) =>
         service.getDetails(
          {
           placeId: place.place_id,
          },
          (placeResult) => {
           const mainPhotoUrl =
            placeResult.photos && placeResult.photos.length
             ? placeResult.photos[0].getUrl()
             : null;
           resolve({
            ...place,
            mainPhotoUrl,
           });
          }
         )
        )
      )
     ).then((placesWithPhotos) => {
      setPlaces(
       placesWithPhotos
        .filter((place) => !place.types.includes('lodging'))
        .map((place) => ({
         ...place,
         mainPhotoUrl: place.mainPhotoUrl,
        }))
      );
     });
    }
   });
  }
 }, [isLoaded, center]);

 const sortedPlaces = places.sort((a, b) => {
  const aDistance =
   window.google.maps.geometry.spherical.computeDistanceBetween(
    new window.google.maps.LatLng(center.lat, center.lng),
    a.geometry.location
   );
  const bDistance =
   window.google.maps.geometry.spherical.computeDistanceBetween(
    new window.google.maps.LatLng(center.lat, center.lng),
    b.geometry.location
   );
  return aDistance - bDistance;
 });

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
     display: 'flex',
     flexDirection: 'column',
    }}
   >
    <div
     style={{
      display: 'inline-block',
      width: '100%',
      height: '400px',
     }}
    >
     <Map defaultCenter={center} defaultZoom={14} mapId={MapConfig.MAP_ID}>
      {places.map((place, index) => (
       <AdvancedMarker
        key={place.id}
        position={{
         lat: place.geometry.location.lat(),
         lng: place.geometry.location.lng(),
        }}
       >
        <Pin scale={2.2}>
         <div
          style={{
           width: '50px',
           height: '50px',
           backgroundImage: `url(${place.mainPhotoUrl})`,
           backgroundSize: 'cover',
           borderRadius: '50%',
           backgroundPosition: 'center',
          }}
         />
        </Pin>
       </AdvancedMarker>
      ))}
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
    <div
     style={{
      marginTop: '20px',
     }}
    >
     <Carousel
      dots={false}
      infinite={true}
      slidesToShow={4}
      slidesToScroll={1}
      prevArrow={<CustomPrevArrow />}
      nextArrow={<CustomNextArrow />}
     >
      {sortedPlaces.map((place) => (
       <div
        style={{
         maxHeight: 400,
        }}
       >
        <Card
         key={place.id}
         style={{ marginLeft: '16px', height: '100%', maxHeight: 500 }}
         cover={<img alt={place.name} src={place.mainPhotoUrl} />}
        >
         <Card.Meta title={place.name} description={place.vicinity} />
        </Card>
       </div>
      ))}
     </Carousel>
    </div>
   </div>
  </APIProvider>
 );
};

export default MapMarker0;
const CustomPrevArrow = (props) => {
 const { className, style, onClick } = props;
 return (
  <div
   className={className}
   style={{
    ...style,
    display: 'block',
    background: 'red',
    width: '40px',
    height: '40px',
    textAlign: 'center',
    lineHeight: '40px',
    fontSize: '24px',
    borderRadius: '50%',
    position: 'absolute',
    top: '50%',
    left: '0',
    transform: 'translateY(-50%)',
    zIndex: '1',
    cursor: 'pointer',
   }}
   onClick={onClick}
  >
   {'<'}
  </div>
 );
};

const CustomNextArrow = (props) => {
 const { className, style, onClick } = props;
 return (
  <div
   className={className}
   style={{
    ...style,
    display: 'block',
    background: 'green',
    width: '40px',
    height: '40px',
    textAlign: 'center',
    lineHeight: '40px',
    fontSize: '24px',
    borderRadius: '50%',
    position: 'absolute',
    top: '50%',
    right: '0',
    transform: 'translateY(-50%)',
    zIndex: '1',
    cursor: 'pointer',
   }}
   onClick={onClick}
  >
   {'>'}
  </div>
 );
};
