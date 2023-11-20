import { FastifyInstance } from "fastify";

export function authRoutes(fastifyInstance: FastifyInstance) {
  fastifyInstance.get("/", (req, res) => {
    return "This message is from auth route";
  });
}
