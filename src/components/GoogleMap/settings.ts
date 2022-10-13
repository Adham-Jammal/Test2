import mapStyles from './mapStyle';

export const containerStyle = {
  width: '100%',
  height: '100%',
};

// center on city or country
export const center = {
  lat: 23.8859,
  lng: 45.0792,
};

// Disable default UI
export const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true
};
