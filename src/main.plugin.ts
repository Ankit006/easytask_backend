import fastify, { FastifyInstance } from "fastify";
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

  // // Connect to mongodb
  fastifyInstance.register(require("@fastify/mongodb"), {
    // force to close the mongodb connection when app stopped
    // the default value is false
    forceClose: true,

    url: "mongodb://root:password@localhost:27017",
  });

  await fastifyInstance.after();
  // Auth Plugin
  fastifyInstance.register(require("./plugins/auth/auth.plugin"), {
    prefix: "/auth",
  });
}
