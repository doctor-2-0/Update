import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { v4 } from "uuid";

export function setupSocketServer(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer);

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    socket.on("join", (roomId) => {
      console.log("user join room", roomId);
      socket.join(roomId);
    });

    socket.on("chat_message", (msg) => {
      console.log("user message", msg);
      msg.MessageID = v4();

      socket.to(msg.ChatroomID).emit("chat_message", msg);
    });
    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
    });
  });

  return io;
}
