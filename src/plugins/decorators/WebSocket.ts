import { ObjectId } from "@fastify/mongodb";
import { FastifyInstance } from "fastify";
import { Socket } from "socket.io";
import { z } from "zod";

const validatedAuth = z.object({
  userId: z.string().refine((value) => ObjectId.isValid(value), {
    message: "Invalid ObjectId",
  }),
});

export default class WebSocket {
  webSocket: Socket;

  constructor(fastify: FastifyInstance) {
    this.webSocket = undefined as any;
    // check if socket has valid userId
    fastify.io.use((socket, next) => {
      const newSocket = socket as any;
      const validData = validatedAuth.safeParse(newSocket.handshake.auth);
      if (!validData.success) {
        return next(new Error("Thou shall not pass"));
      }
      next();
    });

    fastify.io.on("connection", (socket: Socket) => {
      this.webSocket = socket;
      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });
  }
}
