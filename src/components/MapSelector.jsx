// src/components/MapSelector.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapSelector = ({ onLocationSelect, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  // 📌 Límite recomendado para Miramar (General Alvarado)
  const bounds = [
    [-38.33, -57.92], // suroeste
    [-38.20, -57.77]  // noreste
  ];

  function MapClickHandler() {
    useMapEvents({
      click: (e) => {
        const newPosition = [e.latlng.lat, e.latlng.lng];
        setPosition(newPosition);
        onLocationSelect(newPosition[0], newPosition[1]);
      },
    });
    return null;
  }

  return (
    <div className="map-selector-container">
      <p className="map-instructions">
        📍 Haz clic en el mapa para seleccionar la ubicación exacta de tu comercio
      </p>
      
      <MapContainer
        center={position}
        zoom={15}
        minZoom={13}
        maxZoom={18}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        style={{ height: '400px', width: '100%', borderRadius: '8px' }}
        className="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapClickHandler />

        {position && <Marker position={position} />}
      </MapContainer>
    </div>
  );
};

export default MapSelector;
