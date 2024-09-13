// utils/filterProperties.js
export const filterProperties = (
 properties,
 city,
 checkedTypes,
 range,
 roomValue,
 paxValue,
 checkedbasicAmenities
) => {
 if (!Array.isArray(properties)) return [];

 let filtered = properties;

 if (typeof city === 'string' && city.trim()) {
  filtered = filtered.filter(
   (property) =>
    property.placeName &&
    city.toLowerCase().includes(property.placeName.toLowerCase())
  );
 }

 if (checkedTypes.length > 0) {
  filtered = filtered.filter((property) =>
   checkedTypes.includes(property.type)
  );
 }

 if (range[0] !== 0 || range[1] !== 2000) {
  filtered = filtered.filter(
   (property) => property.price >= range[0] && property.price <= range[1]
  );
 }

 if (roomValue !== 0) {
  filtered = filtered.filter(
   (property) => property.rooms !== undefined && property.rooms === roomValue
  );
 }

 if (paxValue !== 0) {
  filtered = filtered.filter(
   (property) =>
    property.capacity !== undefined && property.capacity === paxValue
  );
 }

 if (checkedbasicAmenities.length > 0) {
  filtered = filtered.filter((property) =>
   checkedbasicAmenities.every((amenity) =>
    property.basicAmenities.includes(amenity)
   )
  );
 }

 return filtered;
};
