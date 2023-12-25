import Fastify from "fastify";
import registeredPlugIn from "./main.plugin";
import { FastifyMongoNestedObject, FastifyMongoObject } from "@fastify/mongodb";
import DBClient from "./database/dbClient";
import { JWT } from "@fastify/jwt";
import { HttpErrors } from "@fastify/sensible";

const fastify = Fastify({ logger: true });

// extend fastify for custom plugin
declare module "fastify" {
  interface FastifyInstance {
    envConfig: {
      PORT: string;
      MONGO_URI: string;
      DB: string;
      TOKEN_SECRET: string;
      COOKIE_SECRET: string;
    };
    DBClient: DBClient;
    mongo: FastifyMongoObject & FastifyMongoNestedObject;
    jwt: JWT;
    httpErrors: HttpErrors;
  }
}

// plugins
registeredPlugIn(fastify);

async function main() {
  try {
    await fastify.ready();
    await fastify.listen({ port: parseInt(fastify.envConfig.PORT) });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
