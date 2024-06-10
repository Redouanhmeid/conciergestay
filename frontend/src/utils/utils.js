export const formatTimeFromDatetime = (datetimeString) => {
 const date = new Date(datetimeString);
 const hours = date.getHours();
 const minutes = date.getMinutes().toString().padStart(2, '0');
 return `${hours}:${minutes}`;
};

export const getAdditionalRules = (houseRules) => {
 if (!Array.isArray(houseRules)) {
  return null;
 }
 const additionalRuleEntry = houseRules.find((rule) =>
  rule.startsWith('additionalRules:')
 );
 if (additionalRuleEntry) {
  return additionalRuleEntry.split('additionalRules: ')[1];
 }
 return null;
};

export const getStaticMapUrl = (latitude, longitude, apiKey) => {
 const center = `${latitude},${longitude}`;
 const zoom = 15;
 const size = `2000x600`;
 const mapType = 'roadmap';
 const marker = `color:red|label:C|${latitude},${longitude}`;

 return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=${size}&maptype=${mapType}&markers=${marker}&key=${apiKey}`;
};

export const loadImage = (src) => {
 return new Promise((resolve, reject) => {
  const img = new Image();
  img.src = src;
  img.onload = resolve;
  img.onerror = reject;
 });
};

export const getVideoThumbnail = (url) => {
 let thumbnailUrl = '';
 if (url.includes('youtube.com') || url.includes('youtu.be')) {
  const videoId = url.split('v=')[1] || url.split('/')[3];
  thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
 } else if (url.includes('vimeo.com')) {
  const videoId = url.split('.com/')[1];
  thumbnailUrl = `https://vumbnail.com/${videoId}.jpg`;
 }
 return thumbnailUrl;
};
