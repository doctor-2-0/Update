import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

export function setupSocketServer(server: HttpServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join", (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
      socket.to(roomId).emit("userJoined", socket.id);
    });

    socket.on("chat_message", (message: any) => {
      io.to(message.ChatroomID.toString()).emit("chat_message", message);
    });

    socket.on("callUser", ({ userToCall, signalData, from }) => {
      console.log(`Call request from ${from} to ${userToCall}`);
      io.to(userToCall).emit("callUser", { signal: signalData, from });
    });

    socket.on("answerCall", ({ signal, to }) => {
      console.log(`Call answered by ${socket.id}, sending to ${to}`);
      io.to(to).emit("callAccepted", signal);
    });

    socket.on("endCall", ({ roomId }) => {
      console.log(`Call ended in room ${roomId}`);
      socket.to(roomId).emit("callEnded");
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  return io;
}
