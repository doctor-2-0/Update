import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { ChatMessage } from "./types/ChatMessage";

export function setupSocketServer(server: HttpServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("join", (roomId: string) => {
      socket.join(roomId);
      socket.to(roomId).emit("userJoined", socket.id);
    });

    socket.on("chat_message", (message: ChatMessage) => {
      io.to(message.ChatroomID.toString()).emit("chat_message", message);
    });

    // Add WebRTC signaling events
    socket.on("callUser", ({ userToCall, signalData, from }) => {
      io.to(userToCall).emit("callUser", { signal: signalData, from });
    });

    socket.on("answerCall", ({ signal, to }) => {
      io.to(to).emit("callAccepted", signal);
    });

    socket.on("endCall", ({ roomId }) => {
      socket.to(roomId).emit("callEnded");
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
}
