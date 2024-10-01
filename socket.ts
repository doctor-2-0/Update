import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { v4 } from "uuid";

export function setupSocketServer(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    socket.emit("me", socket.id);

    socket.on("join", (roomId) => {
      console.log(`User ${socket.id} joining room ${roomId}`);
      socket.join(roomId);
      socket.to(roomId).emit("userJoined", socket.id);
      console.log(`Emitted userJoined event to room ${roomId}`);
    });

    socket.on("callUser", ({ userToCall, signalData, from }) => {
      console.log("callUser event received", { userToCall, from });
      io.to(userToCall).emit("callUser", { signal: signalData, from });
    });

    socket.on("answerCall", ({ to, signal }) => {
      console.log("answerCall event received", { to });
      io.to(to).emit("callAccepted", signal);
    });

    socket.on("chat_message", (msg) => {
      console.log("user message", msg);
      if (!msg.MessageID) {
        msg.MessageID = v4();
      }

      socket.to(msg.ChatroomID).emit("chat_message", msg);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
      socket.broadcast.emit("callEnded");
    });
  });

  return io;
}
