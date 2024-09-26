import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, Paper, Avatar, Divider, Link } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import axios from 'axios';

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
  socket: any;
  meetLink: string | null;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ roomId, socket, meetLink }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/chats/${roomId}/messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();

    socket.on('chat_message', (message: Message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      socket.off('chat_message');
    };
  }, [roomId, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData: Partial<Message> = {
      ChatroomID: roomId,
      MessageText: newMessage.trim(),
      Sender: {
        UserID: parseInt(localStorage.getItem('userId') || '0', 10),
        Username: localStorage.getItem('Username') || '',
        FirstName: localStorage.getItem('FirstName') || '',
      },
      SentAt: new Date().toISOString(),
      MessageID: `temp-${Date.now()}`,  // Temporary ID before server confirmation
    };

    try {
      socket.emit('chat_message', messageData);  // Send message to socket
      setNewMessage('');  // Clear input after sending
      setMessages(prevMessages => [...prevMessages, messageData as Message]);

      const response = await axios.post("http://localhost:5000/api/chats/message", {
        chatroomId: roomId,
        messageText: newMessage.trim()
      }, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      // Update message with the correct MessageID returned by the server
      setMessages(prevMessages =>
        prevMessages.map(msg => 
          msg.MessageID === messageData.MessageID ? { ...msg, MessageID: response.data.MessageID } : msg
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => prevMessages.filter(msg => msg.MessageID !== messageData.MessageID));  // Remove failed messages
    }
  };

  return (
    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        Chat Room #{roomId}
      </Typography>
      {meetLink && (
        <Box sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
          <Typography variant="body2">
            Google Meet Link: <Link href={meetLink} target="_blank" rel="noopener noreferrer">{meetLink}</Link>
          </Typography>
        </Box>
      )}
      <List sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {messages.map((message, index) => {
          const isSender = message.Sender.UserID === parseInt(localStorage.getItem('userId') || '0', 10);

          return (
            <React.Fragment key={`${message.MessageID}-${message.SentAt}`}>
              {index > 0 && messages[index - 1].Sender.UserID !== message.Sender.UserID && <Divider sx={{ my: 2 }} />}
              <ListItem
                alignItems="flex-start"
                sx={{
                  justifyContent: isSender ? 'flex-end' : 'flex-start',
                  flexDirection: isSender ? 'row-reverse' : 'row',
                }}
              >
                <Avatar sx={{ bgcolor: 'primary.main', color: 'white', fontSize: '1.5rem', mr: isSender ? 0 : 2, ml: isSender ? 2 : 0 }}>
                  {message.Sender.FirstName[0]} {/* First letter of the sender's first name */}
                </Avatar>
                <Box
                  sx={{
                    bgcolor: isSender ? 'primary.light' : 'grey.200',
                    color: isSender ? 'white' : 'black',
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: '70%',
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography component="span" variant="body2" fontWeight="bold">
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
                          sx={{ display: 'block', mt: 0.5 }}
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
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          variant="outlined"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
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