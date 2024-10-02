"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, CssBaseline, Container, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import HeroSection from "./HeroSection";
import AllServices from "./AllServices";
import AllDoctors from "./AllDoctors";
import AllTestimonials from "./AllTestimonials";
import Statistics from "./Statistics";
import SocialMedia from "./SocialMedia";
import FindDoctor from "./FindDoctor";
import { setLocation } from "@/features/userLocationSlice";
import { setShowMap } from "@/features/HomeSlices/mapSlice";

// Dynamically import the MapContainer and leaflet components since they rely on the window object
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const L = typeof window !== "undefined" ? require("leaflet") : null;

// Fix for default marker icon
import "leaflet/dist/leaflet.css";

let DefaultIcon: L.Icon, GreenIcon: L.Icon, customRedIcon: L.Icon;
if (typeof window !== "undefined" && L) {
  DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  GreenIcon = L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  customRedIcon = L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  L.Marker.prototype.options.icon = DefaultIcon;
}

const GradientBackground = styled(Box)(({ theme }) => ({
  background: `
    linear-gradient(
      45deg,
      ${theme.palette.primary.light}11 0%,
      ${theme.palette.secondary.light}11 50%,
      ${theme.palette.primary.light}11 100%
    )
  `,
  backgroundSize: "400% 400%",
  animation: "gradient 15s ease infinite",
  "@keyframes gradient": {
    "0%": {
      backgroundPosition: "0% 50%",
    },
    "50%": {
      backgroundPosition: "100% 50%",
    },
    "100%": {
      backgroundPosition: "0% 50%",
    },
  },
}));

const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
}));

const FocusedSection = styled(Section)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(10, 4),
  },
  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(10, 8),
  },
}));

const MapWrapper = styled(Paper)(({ theme }) => ({
  height: "600px",
  width: "100%",
  maxWidth: "1300px",
  margin: "0 auto",
  marginBottom: theme.spacing(4),
  borderRadius: "16px",
  border: "12px solid #333",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
  overflow: "hidden",
  "& .leaflet-container": {
    height: "100%",
    width: "100%",
    borderRadius: "8px",
  },
}));

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { latitude, longitude } = useSelector(
    (state: RootState) => state.userLocation
  );
  const { latitude: doctorLatitude, longitude: doctorLongitude } = useSelector(
    (state: RootState) => state.userLocation.selectedDoctorLocation
  );
  const { latitude: searchedLatitude, longitude: searchedLongitude } =
    useSelector((state: RootState) => state.userLocation.searchedLocation);
  const showMap = useSelector((state: RootState) => state.map.showMap);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [showReference, setShowReference] = useState(true);

  useEffect(() => {
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      const { latitude, longitude } = JSON.parse(storedLocation);
      console.log("Stored location:", { latitude, longitude });
      dispatch(setLocation({ latitude, longitude }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (latitude && longitude) {
      setMapCenter([latitude, longitude]);
      localStorage.setItem(
        "userLocation",
        JSON.stringify({ latitude, longitude })
      );
    }
  }, [latitude, longitude]);

  useEffect(() => {
    console.log("Selected doctor location changed:", {
      doctorLatitude,
      doctorLongitude,
    });
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
                <Marker
                  position={[searchedLatitude, searchedLongitude]}
                  icon={customRedIcon}
                >
                  <Popup>Searched location</Popup>
                </Marker>
              )}
            </MapContainer>
          </MapWrapper>
        )}
        <FocusedSection>
          <FindDoctor
            onToggleReference={handleToggleReference}
            onToggleMap={handleToggleMap}
          />
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
