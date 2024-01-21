import { ObjectId } from "@fastify/mongodb";
import { FastifyInstance } from "fastify";
import { Socket } from "socket.io";
import { z } from "zod";
import { IJoinRequestNotification } from "../../database/database.schema";

const validatedAuth = z.object({
  userId: z.string().refine((value) => ObjectId.isValid(value), {
    message: "Invalid ObjectId",
  }),
});

export default class WebSocket {
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
    let userId = "";
    // check if socket has valid userId
    fastify.io.use((socket, next) => {
      const newSocket = socket as any;
      const validData = validatedAuth.safeParse(newSocket.handshake.auth);
      if (!validData.success) {
        return next(new Error("Thou shall not pass"));
      }
      userId = validData.data.userId;
      next();
    });

    // list to connection
    fastify.io.on("connection", (socket: Socket) => {
      // join user to a room.
      // this is a personal room where backend emit different event such as notification
      socket.join(userId);
      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });
  }
  emitEvent(
    type: "notification",
    userId: string,
    payload: IJoinRequestNotification
  ) {
    if (type === "notification") {
      this.fastify.io.to(userId).emit("notification", payload);
      this.fastify.redisCache.storeNotification(userId, payload);
    }
  }
}
