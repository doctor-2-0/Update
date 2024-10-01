import { Send as SendIcon } from "@mui/icons-material";
=======
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import Webcam from "react-webcam";
import Peer from "simple-peer";

import {
  Avatar,
  Box,
  Button,
  Divider,
  Link,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
=======
  Avatar,
  Divider,
  IconButton,
  Grid,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  VideoCall as VideoCallIcon,
  CallEnd as CallEndIcon,
  LocalHospital as HospitalIcon,
} from "@mui/icons-material";
import axios from "@/lib/axios";

interface Message {
  id: number | string;
  chatroomId: number;
  senderId: number;
  messageText: string;
  sender: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
  };
  sentAt: string;
  createdAt: string;
  updatedAt: string;
  MessageID?: string; // Add this line
}

interface ChatMessagesProps {
  roomId: number;
  meetLink: string | null;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ roomId, meetLink }) => {
const ChatMessages: React.FC<ChatMessagesProps> = ({
  roomId,
  socket,
  meetLink,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { auth, checkAuth } = useAuth();
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
  const [isCallActive, setIsCallActive] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);
  const [peer, setPeer] = useState<Peer.Instance | null>(null);
  const [callStatus, setCallStatus] = useState<string>("");
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [isInitiator, setIsInitiator] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`chatroom/messages/${roomId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    const initializeChat = async () => {
      setIsLoading(true);
      try {
        await checkAuth();
        await fetchMessages();
      } catch (error) {
        console.error("Error initializing chat:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();

    const handleChatMessage = (message: Message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...message,
          id: message.MessageID || message.id, // Use MessageID if available
          chatroomId: roomId,
        },
      ]);
    };

    socket.on("chat_message", handleChatMessage);

    return () => {
      socket.off("chat_message", handleChatMessage);
    };
  }, [roomId, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        console.log("Local stream initialized successfully");
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    initializeMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    console.log("Setting up userJoined listener");

    const handleUserJoined = (socketId: string) => {
      console.log("User joined the room:", socketId);
      setRemoteSocketId(socketId);
    };

    socket.on("userJoined", handleUserJoined);

    // Emit join event when component mounts
    if (roomId) {
      console.log("Emitting join event for room:", roomId);
      socket.emit("join", roomId);
    }

    return () => {
      console.log("Cleaning up userJoined listener");
      socket.off("userJoined", handleUserJoined);
    };
  }, [socket, roomId]);

  useEffect(() => {
    socket.on("callUser", ({ signal, from }: { signal: any; from: any }) => {
      console.log("Received callUser event", { signal, from });
      // if (from === socket.id) {
      //   console.log("Ignoring self-call");
      //   return;
      // }
      setCallStatus("Incoming call...");
      setIsCallActive(true);
      setIsInitiator(false);

      const newPeer = new Peer({
        initiator: false,
        trickle: false,
        stream: localStream || undefined,
      });

      newPeer.on("signal", (data) => {
        console.log("Sending answer signal", data);
        socket.emit("answerCall", { signal: data, to: from });
      });

      newPeer.on("stream", (remoteStream) => {
        console.log("Received remote stream");
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });

      newPeer.signal(signal);
      setPeer(newPeer);
    });

    socket.on("callAccepted", (signal: any) => {
      console.log("Call accepted, received signal", signal);
      setCallStatus("Call connected");
      if (peer && isInitiator) {
        peer.signal(signal);
      }
    });

    return () => {
      socket.off("callUser");
      socket.off("callAccepted");
    };
  }, [socket, localStream, peer, isInitiator]);

  useEffect(() => {
    console.log("Socket connected:", socket.connected);

    const onConnect = () => {
      console.log("Socket connected");
    };

    socket.on("connect", onConnect);

    return () => {
      socket.off("connect", onConnect);
    };
  }, [socket]);

  const startCall = () => {
    console.log("Starting call...");
    if (!localStream) {
      console.error("Local stream is not available");
      return;
    }

    if (!remoteSocketId) {
      console.error("No remote user to call");
      return;
    }

    console.log("Calling user:", remoteSocketId);
    setCallStatus("Calling...");
    setIsInitiator(true);

    const newPeer = new Peer({
      initiator: true,
      trickle: false,
      stream: localStream,
    });

    newPeer.on("signal", (data) => {
      console.log("Sending call signal to:", remoteSocketId);
      socket.emit("callUser", {
        userToCall: remoteSocketId,
        signalData: data,
        from: socket.id,
      });
    });

    newPeer.on("stream", (remoteStream) => {
      console.log("Received remote stream");
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    setPeer(newPeer);
    setIsCallActive(true);
  };

  const endCall = () => {
    if (peer) {
      peer.destroy();
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    setIsCallActive(false);
    setLocalStream(null);
    setPeer(null);
    setIsInitiator(false);
    setCallStatus("");
  };

  const handleSendMessage = async () => {
    console.log("handleSendMessage called");
    console.log("auth.user:", auth);
    if (isLoading || !newMessage.trim() || !auth.user) {
      console.log("Cannot send message: ", {
        isLoading,
        newMessage: newMessage.trim(),
        authUser: !!auth.user,
      });
      return;
    }
    console.log("newMessage:", newMessage);

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

      chatroomId: roomId,
      senderId: Number(auth.user.id),
      messageText: newMessage.trim(),
      sender: {
        id: Number(auth.user.id),
        username: auth.user.username,
        firstName: auth.user.firstName,
        lastName: auth.user.lastName,
      },
      sentAt: new Date().toISOString(),
      id: `temp-${Date.now()}`,
    };

    try {
      setNewMessage("");
      setMessages((prevMessages) => [...prevMessages, messageData as Message]);

      const response = await axios.post("chatroom/message", {
        chatroomId: roomId,
        messageText: newMessage.trim(),
      });

      const serverMessage = response.data.data;
      socket.emit("chat_message", {
        ...serverMessage,
        ChatroomID: roomId,
      });

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageData.id
            ? {
                ...serverMessage,
                sender: messageData.sender,
                MessageID: serverMessage.MessageID,
              }
            : msg
        )
      );
    } catch (error: any) {
      console.error("Error sending message:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.MessageID !== messageData.MessageID)

      );
    }
  };

  const renderMessage = (message: Message, index: number) => {
    const isSender = message.senderId === Number(auth?.user?.id);
    const senderName =
      message.sender?.username ||
      `${message.sender?.firstName || ""} ${
        message.sender?.lastName || ""
      }`.trim() ||
      "Unknown User";
    const isDoctor = senderName.startsWith("Dr.") || false;

    return (
      <React.Fragment
        key={`${message.id}-${message.sentAt || message.createdAt}`}
      >
        {index > 0 && messages[index - 1].senderId !== message.senderId && (
          <Divider sx={{ my: 2 }} />
        )}
        <ListItem
          sx={{
            justifyContent: isSender ? "flex-end" : "flex-start",
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: isSender ? "row-reverse" : "row",
              alignItems: "flex-end",
              maxWidth: "70%",
            }}
          >
            {!isSender && (
              <Avatar
                sx={{
                  bgcolor: isDoctor ? "secondary.main" : "primary.main",
                  color: "white",
                  width: 40,
                  height: 40,
                  fontSize: "1rem",
                  mr: 1,
                }}
              >
                {senderName[0].toUpperCase()}
              </Avatar>
            )}
            <Box
              sx={{
                bgcolor: isSender ? "primary.main" : "grey.200",
                color: isSender ? "white" : "text.primary",
                p: 2,
                borderRadius: isSender
                  ? "20px 20px 0 20px"
                  : "20px 20px 20px 0",
                position: "relative",
                boxShadow: 1,
              }}
            >
              {!isSender && (
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  {senderName}
                </Typography>
              )}
              <Typography variant="body1">{message.messageText}</Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 1,
                  textAlign: "right",
                  opacity: 0.7,
                }}
              >
                {format(new Date(message.sentAt || message.createdAt), "HH:mm")}
              </Typography>
            </Box>
          </Box>
        </ListItem>
      </React.Fragment>
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: 2,
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          color: "text.primary",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" color="primary.main">
          <HospitalIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Medical Chat
        </Typography>
        {remoteSocketId && !isCallActive && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={startCall}
            startIcon={<VideoCallIcon />}
            sx={{ borderRadius: 20 }}
          >
            Start Video Call
          </Button>
        )}
        {isCallActive && (
          <Button
            variant="outlined"
            color="error"
            onClick={endCall}
            startIcon={<CallEndIcon />}
            sx={{ borderRadius: 20 }}
          >
            End Call
          </Button>
        )}
        {callStatus && (
          <Typography variant="body2" color="text.secondary">
            {callStatus}
          </Typography>
        )}
      </Box>
      {isCallActive && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <Box sx={{ width: "40%", mr: 2 }}>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              style={{ width: "100%", height: "auto" }}
            />
            <Typography variant="subtitle2" align="center">
              You
            </Typography>
          </Box>
          <Box sx={{ width: "40%" }}>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{ width: "100%", height: "auto" }}
            />
            <Typography variant="subtitle2" align="center">
              Remote User
            </Typography>
          </Box>
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
      <List
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          bgcolor: "grey.100", // Light gray background for the chat area
          backgroundImage: "url('/subtle-medical-pattern.png')",
          backgroundRepeat: "repeat",
        }}
      >
        {messages.map((message, index) => renderMessage(message, index))}
        <div ref={messagesEndRef} />
      </List>
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
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
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton color="primary" aria-label="attach file">
                  <AttachFileIcon />
                </IconButton>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendMessage}
                  endIcon={<SendIcon />}
                  disabled={isLoading || !newMessage.trim()}
                  sx={{ ml: 1 }}
                >
                  {isLoading ? "Loading..." : "Send"}
                </Button>
              </Box>
            ),
          }}
        />
      </Box>
    </Paper>
  );
};

export default ChatMessages;
