import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setLocation, setLoading, setError } from '../../features/userLocationSlice';
import axios from 'axios';

const UserLocation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const dispatch = useDispatch();
  const updateAttempted = useRef(false);

  useEffect(() => {
    const updateUserLocation = async () => {
      if (updateAttempted.current) return;
      updateAttempted.current = true;

      console.log('Starting location update process');
      dispatch(setLoading(true));

      if (!navigator.geolocation) {
        console.log('Geolocation is not supported by your browser');
        dispatch(setError('Geolocation is not supported by your browser'));
        return;
      }

      console.log('Requesting user location');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Location obtained: Lat ${latitude}, Lon ${longitude}`);
          dispatch(setLocation({ latitude, longitude }));
          dispatch(setLoading(false));
          onComplete();
        },
        (error) => {
          console.error('Error getting location:', error);
          dispatch(setError(error.message));
          dispatch(setLoading(false));
          onComplete();
        }
      );
    };

    updateUserLocation();
  }, [dispatch, onComplete]);

  return null;
};

export default UserLocation;