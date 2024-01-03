import { FastifyCookieOptions } from "@fastify/cookie";
import { FastifyCorsOptions } from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import { FastifyJWTOptions } from "@fastify/jwt";
import { FastifyMongodbOptions } from "@fastify/mongodb";
import { FastifyInstance } from "fastify";
import DBClient from "./database/dbClient";
import socketIo from "./plugins/decorators/SocketIo";
import WebSocket from "./plugins/decorators/WebSocket";
import { ImageStorage } from "./plugins/decorators/imageStorage/imageStorage";
import { environmentSchema } from "./validation";
import redis from "./plugins/redis/redis";
import RedisCache from "./plugins/decorators/RedisCache";
//  This function holds all global register plugin and decorators
export default async function registeredPlugIn(
  fastifyInstance: FastifyInstance
) {
  /////////////////////////////////// ENV plugin    /////////////////////////////////////////////////
  fastifyInstance.register(fastifyEnv, {
    confKey: "envConfig",
    schema: environmentSchema,
    dotenv: true,
  });
  await fastifyInstance.after();

  //////////////////////////////////// mongodb connection //////////////////////////////////////////////////////////////
  fastifyInstance.register(require("@fastify/mongodb"), {
    forceClose: true,
    url: fastifyInstance.envConfig.MONGO_URI,
  } as FastifyMongodbOptions);

  await fastifyInstance.after();

  /**
   *  ------------------------------------- DBClient Decorator -------------------------------------------
   */

  // This decorator is used to easily access DB client.
  // You don't have to write this  "fastifyInstance.mongo.client.db('yourdb')" every time if you want
  // to access to client.
  fastifyInstance.decorate("DBClient", new DBClient(fastifyInstance));

  ///////////////////////////////// jsonwebtoken plugin ////////////////////////////////////////////////
  fastifyInstance.register(require("@fastify/jwt"), {
    secret: fastifyInstance.envConfig.TOKEN_SECRET,
  } as FastifyJWTOptions);

  /////////////////////////// cookie plugin ///////////////////////////////////////////////////////////////////
  fastifyInstance.register(require("@fastify/cookie"), {
    secret: fastifyInstance.envConfig.COOKIE_SECRET,
    hook: "onRequest",
    parseOptions: {},
  } as FastifyCookieOptions);

  /////////////////////////////// CORS plugin /////////////////////////////////////////////////////////////////////////////
  fastifyInstance.register(require("@fastify/cors"), {
    origin: fastifyInstance.envConfig.FRONTEND_URL,
    credentials: true,
  } as FastifyCorsOptions);
  await fastifyInstance.after();

  /////////////////////////////// socket io plugin ///////////////////////////////////////////////////////////////////////////
  // fastifyInstance.register(require("fastify-socket.io"), {
  //   cors: {
  //     origin: fastifyInstance.envConfig.FRONTEND_URL,
  //     credentials: true,
  //   },
  // } as ServerOptions);
  // await fastifyInstance.after();

  /////////////////////////////// authentation plugin /////////////////////////////////////////////////////////////////////////////
  fastifyInstance.register(require("./plugins/auth/auth.plugin"), {
    prefix: "/auth",
  });

  ////////////////////////////////// private routes plugin  (routes under this plugin requires authorization.) /////////////////////////////////////////////////
  fastifyInstance.register(require("./plugins/guard/private.plugin"));

  fastifyInstance.decorate("imageStorage", new ImageStorage(fastifyInstance));

  // connect to websocket
  fastifyInstance.decorate("io", socketIo(fastifyInstance));
  fastifyInstance.decorate("webSocket", new WebSocket(fastifyInstance));

  // connect to redis
  fastifyInstance.register(redis);
  await fastifyInstance.after();
  fastifyInstance.decorate("redisCache", new RedisCache(fastifyInstance));
}
