/* eslint-disable */
import React, { useRef, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
// map settings
import { center, options } from './settings';

import Loading from '../Loading';
import './index.less';

interface center {
  lat: number;
  lng: number;
}
interface GoogleMapProps {
  handlePointClick: (val: google.maps.LatLngLiteral) => void;
  position?: google.maps.LatLngLiteral;
  withClick: boolean;
  centerLatLng?: center;
}

const GoogleMapComp: React.FC<GoogleMapProps> = ({
  handlePointClick,
  position,
  centerLatLng,
  withClick = false,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY!,
  });

  const [clickedPos, setClickedPos] = useState<google.maps.LatLngLiteral>(
    {} as google.maps.LatLngLiteral
  );

  useEffect(() => {
    if (position) {
      setClickedPos(position);
    }
  }, [position]);

  // save map in ref if we want to access the map
  const mapRef = useRef<google.maps.Map | null>(null);

  const onLoad = (map: google.maps.Map): void => {
    mapRef.current = map;
  };

  const onUnMount = (): void => {
    mapRef.current = null;
  };
  // handle click on map
  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e !== null) {
      setClickedPos({ lat: e!.latLng!.lat(), lng: e!.latLng!.lng() });
      handlePointClick({ lat: e!.latLng!.lat(), lng: e!.latLng!.lng() });
    }
  };

  return (
    <div className="map-wrap">
      {!isLoaded ? (
        <Loading />
      ) : (
        <GoogleMap
          options={options as google.maps.MapOptions}
          zoom={7}
          onLoad={onLoad}
          onUnmount={onUnMount}
          center={centerLatLng && centerLatLng.lat !== 0 ? centerLatLng : center}
          onClick={withClick ? () => {} : onMapClick}
        >
          {clickedPos.lat ? <Marker position={clickedPos} /> : null}
        </GoogleMap>
      )}
    </div>
  );
};

export default GoogleMapComp;
