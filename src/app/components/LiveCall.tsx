import React, { useRef, useEffect } from "react";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import {
  CallEnd as CallEndIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
} from "@mui/icons-material";

interface LiveCallProps {
  remoteStream: MediaStream | null;
  onEndCall: () => void;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
}

const LiveCall: React.FC<LiveCallProps> = ({
  remoteStream,
  onEndCall,
  isAudioMuted,
  isVideoMuted,
  onToggleAudio,
  onToggleVideo,
}) => {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius: 2,
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Typography variant="h5" color="white">
            Waiting for remote video...
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 2,
          bgcolor: "rgba(0,0,0,0.5)",
          borderRadius: 5,
          padding: 1,
        }}
      >
        <IconButton onClick={onToggleAudio} color="primary">
          {isAudioMuted ? <MicOffIcon /> : <MicIcon />}
        </IconButton>
        <IconButton onClick={onToggleVideo} color="primary">
          {isVideoMuted ? <VideocamOffIcon /> : <VideocamIcon />}
        </IconButton>
        <IconButton onClick={onEndCall} color="error">
          <CallEndIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default LiveCall;
