import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  isSuccess: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  title,
  message,
  isSuccess,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        {isSuccess ? (
          <CheckCircleOutlineIcon
            sx={{ fontSize: 60, color: "success.main", mb: 2 }}
          />
        ) : (
          <ErrorOutlineIcon sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
        )}
        <Typography
          id="confirmation-modal-title"
          variant="h6"
          component="h2"
          gutterBottom
        >
          {title}
        </Typography>
        <Typography id="confirmation-modal-description" sx={{ mt: 2, mb: 3 }}>
          {message}
        </Typography>
        <Button
          variant="contained"
          color={isSuccess ? "primary" : "error"}
          onClick={onClose}
          sx={{ minWidth: 120 }}
        >
          {isSuccess ? "OK" : "Close"}
        </Button>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
