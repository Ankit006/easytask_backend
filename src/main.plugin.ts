import { FastifyInstance } from "fastify";

export default function registeredPlugIn(fastifyInstance: FastifyInstance) {
  fastifyInstance.register(require("./auth/auth.plugin"), { prefix: "/auth" });
}
