import { FastifyInstance } from "fastify";
import fastifyEnv from "@fastify/env";
import { environmentSchema } from "./validation";
import DBClient from "./database/dbClient";
import { FastifyCookieOptions } from "@fastify/cookie";
import { FastifyJWTOptions } from "@fastify/jwt";
import { FastifyMongodbOptions } from "@fastify/mongodb";

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
    forceClose: true,
    url: fastifyInstance.envConfig.MONGO_URI,
  } as FastifyMongodbOptions);

  await fastifyInstance.after();

  // This decorator is used to easily access DB client.
  // You don't have to write this  "fastifyInstance.mongo.client.db('yourdb')" every time if you want
  // to access to client.
  fastifyInstance.decorate("DBClient", new DBClient(fastifyInstance));

  // Fastify jwt plugin
  fastifyInstance.register(require("@fastify/jwt"), {
    secret: fastifyInstance.envConfig.TOKEN_SECRET,
  } as FastifyJWTOptions);

  // Fastify cookie plugin
  fastifyInstance.register(require("@fastify/cookie"), {
    secret: fastifyInstance.envConfig.COOKIE_SECRET,
    hook: "onRequest",
    parseOptions: {},
  } as FastifyCookieOptions);

  fastifyInstance.register(require("fastify-socket.io"));
  await fastifyInstance.after();

  // Auth Plugin
  // This plugin is for signIn, signUp
  fastifyInstance.register(require("./plugins/auth/auth.plugin"), {
    prefix: "/auth",
  });

  // This plugin holds routes (or I should say plugin 🧐) that requires authorization.
  fastifyInstance.register(require("./plugins/guard/private.plugin"));

  fastifyInstance.get("/ws", (req, reply) => {
    fastifyInstance.io.emit("hello");
  });
}
