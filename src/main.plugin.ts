import { FastifyInstance } from "fastify";
import fastifyEnv from "@fastify/env";
import environmentSchema from "./schema/environment.schema";

export default async function registeredPlugIn(
  fastifyInstance: FastifyInstance
) {
  // ENV plugin
  fastifyInstance.register(fastifyEnv, {
    confKey: "envConfig",
    schema: environmentSchema,
    dotenv: true,
  });

  await fastifyInstance.after();

  // Auth Plugin
  fastifyInstance.register(require("./plugins/auth/auth.plugin"), {
    prefix: "/auth",
  });
}
