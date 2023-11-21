import Fastify from "fastify";
import registeredPlugIn from "./main.plugin";
import { FastifyMongoNestedObject, FastifyMongoObject } from "@fastify/mongodb";

const fastify = Fastify({ logger: true });

// extend fastify
declare module "fastify" {
  interface FastifyInstance {
    envConfig: {
      PORT: string;
      MONGO_URI: string;
    };
    mongo: FastifyMongoObject & FastifyMongoNestedObject;
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
