import { FastifyInstance } from "fastify";
import { Server } from "socket.io";

export default function socketIo(fastify: FastifyInstance) {
  const io = new Server(fastify.server, {
    cors: {
      origin: fastify.envConfig.FRONTEND_URL,
      credentials: true,
    },
  });
  return io;
}
