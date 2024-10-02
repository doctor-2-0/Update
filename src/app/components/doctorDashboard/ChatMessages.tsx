import { Send as SendIcon } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

interface Message {
  MessageID: number | string;
  ChatroomID: number;
  SenderID: number;
  MessageText: string;
  Sender: {
    UserID: number;
    Username: string;
    FirstName: string;
  };
  SentAt: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessagesProps {
  roomId: number;
  meetLink: string | null;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ roomId, meetLink }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<any>(null);
  const [userData, setUserData] = useState({
    userId: 0,
    username: "",
    firstName: "",
  });
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = parseInt(localStorage.getItem("userId") || "0", 10);
      const username = localStorage.getItem("Username") || "";
      const firstName = localStorage.getItem("FirstName") || "";
      setUserData({ userId, username, firstName });

      const newSocket = io("http://localhost:5000");
      setSocket(newSocket);

      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:5000/api/chats/${roomId}/messages`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();

      newSocket.on("chat_message", (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        newSocket.off("chat_message");
        newSocket.disconnect();
      };
    }
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData: Partial<Message> = {
      ChatroomID: roomId,
      MessageText: newMessage.trim(),
      Sender: {
        UserID: userData.userId,
        Username: userData.username,
        FirstName: userData.firstName,
      },
      SentAt: new Date().toISOString(),
      MessageID: `temp-${Date.now()}`,
    };

    try {
      if (socket) {
        socket.emit("chat_message", messageData);
        setNewMessage("");
        setMessages((prevMessages) => [
          ...prevMessages,
          messageData as Message,
        ]);

        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:5000/api/chats/message",
          { chatroomId: roomId, messageText: newMessage.trim() },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.MessageID === messageData.MessageID
              ? { ...msg, MessageID: response.data.MessageID }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.MessageID !== messageData.MessageID)
      );
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h6"
        sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}
      >
        Chat Room #{roomId}
      </Typography>
      {meetLink && (
        <Box sx={{ p: 2, bgcolor: "info.light", color: "info.contrastText" }}>
          <Typography variant="body2">
            Google Meet Link:{" "}
            <Link href={meetLink} target="_blank" rel="noopener noreferrer">
              {meetLink}
            </Link>
          </Typography>
        </Box>
      )}
      <List sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {messages.map((message, index) => {
          const isSender = message.Sender.UserID === userData.userId;

          return (
            <React.Fragment key={`${message.MessageID}-${message.SentAt}`}>
              {index > 0 &&
                messages[index - 1].Sender.UserID !== message.Sender.UserID && (
                  <Divider sx={{ my: 2 }} />
                )}
              <ListItem
                alignItems="flex-start"
                sx={{
                  justifyContent: isSender ? "flex-end" : "flex-start",
                  flexDirection: isSender ? "row-reverse" : "row",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    fontSize: "1.5rem",
                    mr: isSender ? 0 : 2,
                    ml: isSender ? 2 : 0,
                  }}
                >
                  {message.Sender.FirstName[0]}
                </Avatar>
                <Box
                  sx={{
                    bgcolor: isSender ? "primary.light" : "grey.200",
                    color: isSender ? "white" : "black",
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: "70%",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        component="span"
                        variant="body2"
                        fontWeight="bold"
                      >
                        {message.Sender.Username}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          {message.MessageText}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          {new Date(message.SentAt).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </Box>
              </ListItem>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </List>
      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <TextField
          fullWidth
          variant="outlined"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSendMessage();
              e.preventDefault();
            }
          }}
          multiline
          maxRows={4}
          InputProps={{
            endAdornment: (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                endIcon={<SendIcon />}
                disabled={!newMessage.trim()}
              >
                Send
              </Button>
            ),
          }}
        />
      </Box>
    </Paper>
  );
};

export default ChatMessages;
const db = require('../models'); // Import the User model
const { Op } = require('sequelize');

const getAllDoctorsForHome = async (req, res) => {
  try {
    const doctors = await db.User.findAll({
      where: { Role: 'Doctor' },
      attributes: ['UserID', 'FirstName', 'LastName', 'Speciality', 'Bio', 'LocationLatitude', 'LocationLongitude', 'Email'],
      attributes: ['UserID', 'FirstName', 'LastName', 'Speciality', 'Bio', 'LocationLatitude', 'LocationLongitude'],
      include: [{ model: db.Media, as: 'ProfilePicture', required: false }],
    });

    const doctorsWithMedia = doctors.map(doctor => ({
      UserID: doctor.UserID,
      FirstName: doctor.FirstName,
      LastName: doctor.LastName,
      Speciality: doctor.Speciality,
      Bio: doctor.Bio,
      LocationLatitude: doctor.LocationLatitude,
      LocationLongitude: doctor.LocationLongitude,
      imageUrl: doctor.ProfilePicture ? doctor.ProfilePicture.url : null,
    }));

    return res.status(200).json(doctorsWithMedia);
  } catch (error) {
    console.error('Error in getAllDoctorsForHome:', error);
    return res.status(500).json({ message: 'Error retrieving doctors', error: error.toString() });
  }
};
 

  
const searchDoctors = async (req, res) => {
  try {
    const { name, speciality, available, nearMe, perimeter, latitude, longitude, coords } = req.body;
    const userLocation = coords;

    let whereClause = { Role: 'Doctor' };

    if (name) whereClause.FirstName = { [Op.like]: `%${name}%` };
    if (speciality) whereClause.Speciality = { [Op.like]: `%${speciality}%` };
    if (available) whereClause.Available = true;

    const doctors = await db.User.findAll({
      where: whereClause,
      attributes: ['UserID', 'FirstName', 'LastName', 'Speciality', 'Bio', 'LocationLatitude', 'LocationLongitude'],
      include: [{ model: db.Media, as: 'ProfilePicture', required: false }],
    });

    let filteredDoctors = doctors;

    const searchLatitude = latitude || userLocation.LocationLatitude;
    const searchLongitude = longitude || userLocation.LocationLongitude;

    if (searchLatitude && searchLongitude && (nearMe || perimeter !== null)) {
      const searchPerimeter = nearMe ? 20 : perimeter;
      filteredDoctors = doctors.filter(doctor => {
        if (doctor.LocationLatitude && doctor.LocationLongitude) {
          const distance = calculateDistance(searchLatitude, searchLongitude, doctor.LocationLatitude, doctor.LocationLongitude);
          return searchPerimeter === null || distance <= searchPerimeter;
        }
        return false;
      });
    }

    const doctorsWithMedia = filteredDoctors.map(doctor => ({
      UserID: doctor.UserID,
      FirstName: doctor.FirstName,
      LastName: doctor.LastName,
      Speciality: doctor.Speciality,
      Bio: doctor.Bio,
      LocationLatitude: doctor.LocationLatitude,
      LocationLongitude: doctor.LocationLongitude,
      imageUrl: doctor.ProfilePicture ? doctor.ProfilePicture.url : null,
    }));

    return res.status(200).json(doctorsWithMedia);
  } catch (error) {
    console.error('Error in searchDoctors:', error);
    return res.status(500).json({ message: 'Error searching doctors', error: error.toString() });
  }
};
  
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }
  
  module.exports = {
    getAllDoctorsForHome,
    searchDoctors,
  };
  
  ... rest of the file remains unchanged


  Create a new Doctor profile
const createDoctorProfile = async (req, res) => {
    try {
        const { FirstName, LastName, Username, Password, Email, Speciality, LocationLatitude, LocationLongitude, Bio, MeetingPrice } = req.body;
        
        const doctor = await db.User.create({
            FirstName,
            LastName,
            Username,
            Password, // Make sure to hash the password before saving
            Email,
            Role: 'Doctor', // Doctor role only
            Speciality,
            LocationLatitude,
            LocationLongitude,
            Bio,
            MeetingPrice
        });
        
        return res.status(201).json(doctor);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating doctor profile', error });
    }
};

// Get all Doctor profiles
const getDoctors = async (req, res) => {
    try {
        const doctors = await db.User.findAll({ where: { Role: 'Doctor' } });
        return res.status(200).json(doctors);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving doctors', error });
    }
};

// Get a single Doctor profile by ID
const getDoctorById = async (req, res) => {
    try {
        const doctor = await db.User.findOne({ where: { UserID: req.params.id, Role: 'Doctor' } });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        return res.status(200).json(doctor);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving doctor', error });
    }
};

// Update a Doctor profile
const updateDoctorProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDoctor = await db.User.update(req.body, { where: { UserID: id, Role: 'Doctor' } });
        
        if (!updatedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        return res.status(200).json({ message: 'Doctor profile updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating doctor profile', error });
    }
};

// Delete a Doctor profile
const deleteDoctorProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await db.User.destroy({ where: { UserID: id, Role: 'Doctor' } });
        
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        return res.status(200).json({ message: 'Doctor profile deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting doctor profile', error });
    }
};