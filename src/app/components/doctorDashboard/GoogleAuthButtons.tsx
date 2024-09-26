import React, { useEffect, useState } from 'react';
import { Button, Snackbar } from '@mui/material';
import { gapi } from 'gapi-script';

const CLIENT_ID = '402630783457-0bdo62sn6j3jfj90dfku1d5275ffh6ks.apps.googleusercontent.com';
const API_KEY = 'AIzaSyB0qyW6hZRKWDyxFENKHHO6zv3u83UsihA';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

interface GoogleAuthButtonsProps {
  onMeetLinkCreated: (link: string) => void;
}

const GoogleAuthButtons = ({ onMeetLinkCreated }: GoogleAuthButtonsProps) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initClient = async () => {
      try {
        await new Promise((resolve) => gapi.load('client:auth2', resolve));
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        });

        const authInstance = gapi.auth2.getAuthInstance();
        setIsSignedIn(authInstance.isSignedIn.get());
        authInstance.isSignedIn.listen(setIsSignedIn);
      } catch (error) {
        console.error('Error initializing Google API client:', error);
        setError('Failed to initialize Google API client. Please try again.');
      }
    };

    initClient();
  }, []);

  const handleAuthClick = async () => {
    try {
      await gapi.auth2.getAuthInstance().signIn();
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Failed to sign in. Please try again.');
    }
  };

  const handleSignOutClick = async () => {
    try {
      await gapi.auth2.getAuthInstance().signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    }
  };

  const createMeetLink = async () => {
    if (!gapi.client.calendar) {
      console.error('Google Calendar API not loaded');
      setError('Google Calendar API not loaded. Please try again.');
      return;
    }

    const event = {
      summary: 'Chat Room Video Call',
      start: {
        dateTime: new Date().toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      conferenceData: {
        createRequest: {
          requestId: 'unique-request-id', // A unique ID for the request
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    try {
      const response = await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
      });

      const meetLink = response.result.hangoutLink;
      console.log('Meet link:', meetLink);
      if (meetLink) {
        onMeetLinkCreated(meetLink);
      } else {
        setError('Failed to create Meet link. Please try again.');
      }
    } catch (error) {
      console.error('Error creating Meet link:', error);
      setError('Error creating Meet link. Please try again.');
    }
  };

  return (
    <div>
      {!isSignedIn ? (
        <Button variant="contained" onClick={handleAuthClick}>Sign in with Google</Button>
      ) : (
        <>
          <Button variant="contained" onClick={handleSignOutClick}>Sign out</Button>
          <Button variant="contained" onClick={createMeetLink}>Create Google Meet Link</Button>
        </>
      )}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </div>
  );
};

export default GoogleAuthButtons;
