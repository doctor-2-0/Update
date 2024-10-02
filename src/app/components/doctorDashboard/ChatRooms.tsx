"use client";
import axios from "@/lib/axios";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import ChatMessages from "./ChatMessages";

interface ChatRoom {
  id: number;
  patient?: {
    firstName: string;
    lastName: string;
    id?: number;
  };
  doctor?: {
    firstName: string;
    lastName: string;
    id?: number;
  };
  patientId?: number;
  doctorId?: number;
}

interface ChatRoomsProps {
  onClose?: () => void;
}

const socket =
  typeof window !== "undefined" ? io("http://localhost:3000") : null;

const ChatRooms: React.FC<ChatRoomsProps> = ({ onClose }) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDoctor, setIsDoctor] = useState<boolean | null>(null);
  const [meetLink, setMeetLink] = useState<string | null>(null);

  const getRoomAndJoin = (chatRoom: ChatRoom) => {
    setSelectedRoom(chatRoom.id);
    if (socket) {
      socket.emit("join", chatRoom.id);
    }
  };

  useEffect(() => {
    const checkUserRole = async () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const doctorResponse = await axios.get("/auth/check-doctor", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (doctorResponse.data.isDoctor) {
          setIsDoctor(true);
          return;
        }

        const patientResponse = await axios.get("/auth/check-patient", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (patientResponse.data.isPatient) {
          setIsDoctor(false);
          return;
        }

        setError("User role could not be determined.");
      } catch (error) {
        console.error("Error checking user role:", error);
        setError("Error checking user role. Please try again.");
      }
    };

    checkUserRole();
  }, []);

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (isDoctor === null) return;

      try {
        const response = await axios.get("/chatroom", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setChatRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
        setError("Error fetching chat rooms. Please try again.");
        setLoading(false);
      }
    };

    if (isDoctor !== null) {
      fetchChatRooms();
    }
  }, [isDoctor]);

  const getDisplayName = (room: ChatRoom) => {
    if (isDoctor) {
      return room.patient
        ? `${room.patient.firstName} ${room.patient.lastName}`
        : `Patient ID: ${room.patientId || "Unknown"}`;
    } else {
      return room.doctor
        ? `Dr. ${room.doctor.firstName} ${room.doctor.lastName}`
        : `Doctor ID: ${room.doctorId || "Unknown"}`;
    }
  };

  const handleMeetLinkCreated = (link: string) => {
    setMeetLink(link);
    if (selectedRoom && socket) {
      const messageData = {
        ChatroomID: selectedRoom,
        MessageText: `New Google Meet link: ${link}`,
        Sender: {
          UserID: parseInt(localStorage.getItem("userId") || "0", 10),
          Username: localStorage.getItem("Username") || "",
          FirstName: localStorage.getItem("FirstName") || "",
        },
        SentAt: new Date().toISOString(),
      };
      socket.emit("chat_message", messageData);
    }
  };const db = require('../models');
  const cloudinary = require('cloudinary').v2;
  const { Op } = require('sequelize');
  require('dotenv').config();
  
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  
  exports.uploadMedia = async (req, res) => {
    try {
      const { base64 } = req.body;
      const userId = req.user.UserID;
  
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(base64, {
        folder: 'user_profiles'
      });
  
      // Check if media already exists for the user
      const existingMedia = await db.Media.findOne({ where: { UserID: userId } });
  
      if (existingMedia) {
        // Update the existing media entry
        existingMedia.url = result.secure_url;
        await existingMedia.save();
        return res.status(200).json({ message: 'Media updated successfully', media: existingMedia });
      } else {
        // Create a new media entry
        const newMedia = await db.Media.create({
          UserID: userId,
          url: result.secure_url
        });
        return res.status(201).json({ message: 'Media uploaded successfully', media: newMedia });
      }
    } catch (error) {
      console.error('Error uploading media:', error);
      res.status(500).json({ message: 'Error uploading media', error: error.message });
    }
  };

  if (isDoctor === null) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Box sx={{ width: 250, borderRight: "1px solid #ccc" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography variant="h6">Chat Rooms</Typography>
          {onClose && (
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography sx={{ p: 2, color: "red" }}>{error}</Typography>
        ) : (
          <List>
            {chatRooms.map((room) => (
              <ListItem disablePadding key={room.id}>
                <ListItemButton
                  onClick={() => getRoomAndJoin(room)}
                  selected={selectedRoom === room.id}
                >
                  <ListItemText primary={getDisplayName(room)} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {selectedRoom ? (
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <ChatMessages roomId={selectedRoom} meetLink={meetLink} />
        </Box>
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body1">
            Select a chat room to view messages
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatRooms;
