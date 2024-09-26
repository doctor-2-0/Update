import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Box, Typography, CircularProgress, IconButton } from '@mui/material';
import axios from 'axios';
import ChatMessages from './ChatMessages';
import GoogleAuthButtons from './GoogleAuthButtons'; // Import GoogleAuthButtons for Google Meet link creation
import CloseIcon from '@mui/icons-material/Close';
import io from 'socket.io-client';

interface ChatRoom {
  ChatroomID: number;
  Patient?: {
    FirstName: string;
    LastName: string;
    UserID?: number;
  };
  Doctor?: {
    FirstName: string;
    LastName: string;
    UserID?: number;
  };
  PatientID?: number;
  DoctorID?: number;
}

interface ChatRoomsProps {
  onClose?: () => void;
}

const socket = io('http://localhost:4000');

const ChatRooms: React.FC<ChatRoomsProps> = ({ onClose }) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDoctor, setIsDoctor] = useState<boolean | null>(null);
  const [meetLink, setMeetLink] = useState<string | null>(null);

  const getRoomAndJoin = (chatRoom: ChatRoom) => {
    setSelectedRoom(chatRoom.ChatroomID);
    socket.emit('join', chatRoom.ChatroomID);
  };

  useEffect(() => {
    const checkUserRole = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const doctorResponse = await axios.get('http://localhost:5000/api/users/check-doctor', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (doctorResponse.data.isDoctor) {
          setIsDoctor(true);
          return;
        }

        const patientResponse = await axios.get('http://localhost:5000/api/users/check-patient', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (patientResponse.data.isPatient) {
          setIsDoctor(false);
          return;
        }

        setError('User role could not be determined.');
      } catch (error) {
        console.error('Error checking user role:', error);
        setError('Error checking user role. Please try again.');
      }
    };

    checkUserRole();
  }, []);

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (isDoctor === null) return; // Wait until we know the user role

      try {
        const response = await axios.get('http://localhost:5000/api/chats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('API response:', response.data);
        setChatRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
        setError('Error fetching chat rooms. Please try again.');
        setLoading(false);
      }
    };

    if (isDoctor !== null) {
      fetchChatRooms();
    }
  }, [isDoctor]);

  const getDisplayName = (room: ChatRoom) => {
    console.log('Room data:', room);
    if (isDoctor) {
      if (room.Patient) {
        return `${room.Patient.FirstName} ${room.Patient.LastName}`;
      } else if (room.PatientID) {
        return `Patient ID: ${room.PatientID}`;
      } else {
        return 'Unknown Patient';
      }
    } else {
      if (room.Doctor) {
        return `Dr. ${room.Doctor.FirstName} ${room.Doctor.LastName}`;
      } else if (room.DoctorID) {
        return `Doctor ID: ${room.DoctorID}`;
      } else {
        return 'Unknown Doctor';
      }
    }
  };

  const handleMeetLinkCreated = (link: string) => {
    setMeetLink(link);
    // Send the Meet link as a message in the chat
    if (selectedRoom) {
      const messageData = {
        ChatroomID: selectedRoom,
        MessageText: `New Google Meet link: ${link}`,
        Sender: {
          UserID: parseInt(localStorage.getItem('userId') || '0', 10),
          Username: localStorage.getItem('Username') || '',
          FirstName: localStorage.getItem('FirstName') || '',
        },
        SentAt: new Date().toISOString(),
      };
      socket.emit('chat_message', messageData);
    }
  };

  if (isDoctor === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      {/* Chat Rooms List */}
      <Box sx={{ width: 250, borderRight: '1px solid #ccc' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Typography variant="h6">Chat Rooms</Typography>
          {onClose && (
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography sx={{ p: 2, color: 'red' }}>{error}</Typography>
        ) : (
          <List>
            {chatRooms.map((room) => (
              <ListItem disablePadding key={room.ChatroomID}>
                <ListItemButton
                  onClick={() => getRoomAndJoin(room)}
                  selected={selectedRoom === room.ChatroomID}
                >
                  <ListItemText primary={getDisplayName(room)} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Chat Messages Section */}
      {selectedRoom ? (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <ChatMessages socket={socket} roomId={selectedRoom} meetLink={meetLink} />
          <GoogleAuthButtons onMeetLinkCreated={handleMeetLinkCreated} />
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body1">Select a chat room to view messages</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatRooms;
