/// <reference path="../../features/HomeSlices/react-leaflet.d.ts" />
import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Container, Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import HeroSection from './HeroSection';
import AllServices from './AllServices';
import AllDoctors from './AllDoctors';
import AllTestimonials from './AllTestimonials';
import Statistics from './Statistics';
import SocialMedia from './SocialMedia';
import FindDoctor from './FindDoctor';
import { setLocation } from '../../features/userLocationSlice';
import { setShowMap } from '../../features/HomeSlices/mapSlice';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Default icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Green icon for current location
let GreenIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Custom red icon for searched location
const customRedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const GradientBackground = styled(Box)(({ theme }) => ({
  background: `
    linear-gradient(
      45deg,
      ${theme.palette.primary.light}11 0%,
      ${theme.palette.secondary.light}11 50%,
      ${theme.palette.primary.light}11 100%
    )
  `,
  backgroundSize: '400% 400%',
  animation: 'gradient 15s ease infinite',
  '@keyframes gradient': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
  },
}));

const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
}));

const FocusedSection = styled(Section)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10, 4),
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(10, 8),
  },
}));

const MapWrapper = styled(Paper)(({ theme }) => ({
  height: '600px',
  width: '100%',
  maxWidth: '1300px',
  margin: '0 auto',
  marginBottom: theme.spacing(4),
  borderRadius: '16px',
  border: '12px solid #333',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  overflow: 'hidden',
  '& .leaflet-container': {
    height: '100%',
    width: '100%',
    borderRadius: '8px',
  },
}));

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { latitude, longitude } = useSelector((state: RootState) => state.userLocation);
  const { latitude: doctorLatitude, longitude: doctorLongitude } = useSelector((state: RootState) => state.userLocation.selectedDoctorLocation);
  const { latitude: searchedLatitude, longitude: searchedLongitude } = useSelector((state: RootState) => state.userLocation.searchedLocation);
  const showMap = useSelector((state: RootState) => state.map.showMap);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [showReference, setShowReference] = useState(true);

  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      const { latitude, longitude } = JSON.parse(storedLocation);
      dispatch(setLocation({ latitude, longitude }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (latitude && longitude) {
      setMapCenter([latitude, longitude]);
      localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
    }
  }, [latitude, longitude]);

  useEffect(() => {
    console.log('Selected doctor location changed:', { doctorLatitude, doctorLongitude });
  }, [doctorLatitude, doctorLongitude]);

  const handleToggleReference = () => {
    setShowReference(!showReference);
  };

  const handleToggleMap = () => {
    dispatch(setShowMap(!showMap));
  };

  return (
    <GradientBackground>
      <CssBaseline />
      <HeroSection />
      <Section>
        <Statistics />
      </Section>
      <Container maxWidth="xl">
        {showMap && mapCenter && (
          <MapWrapper id="user-location-map">
            <MapContainer center={mapCenter} zoom={13}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={mapCenter} icon={GreenIcon}>
                <Popup>Your current location</Popup>
              </Marker>
              {doctorLatitude && doctorLongitude && (
                <Marker position={[doctorLatitude, doctorLongitude]}>
                  <Popup>Doctor's location</Popup>
                </Marker>
              )}
              {searchedLatitude && searchedLongitude && showReference && (
                <Marker position={[searchedLatitude, searchedLongitude]} icon={new L.Icon({
                  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
                })}>
                  <Popup>Searched location</Popup>
                </Marker>
              )}
            </MapContainer>
          </MapWrapper>
        )}
        <FocusedSection>
          <FindDoctor onToggleReference={handleToggleReference} onToggleMap={handleToggleMap} />
        </FocusedSection>
        <Section>
          <AllServices />
        </Section>
        <Section>
          <AllDoctors />
        </Section>
        <Section>
          <AllTestimonials />
        </Section>
      </Container>
      <SocialMedia />
    </GradientBackground>
  );
};

export default Home;
