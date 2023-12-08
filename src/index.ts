import Fastify from "fastify";
import registeredPlugIn from "./main.plugin";
import { FastifyMongoNestedObject, FastifyMongoObject } from "@fastify/mongodb";
import DBClient from "./database/dbClient";
import { JWT } from "@fastify/jwt";
import { Socket } from "socket.io";
import Cloudinary from "cloudinary";

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
      APP_URL: string;
      FRONTEND_URL: string;
      CLOUDENARY_API_KEY: string;
      CLOUDENARY_CLOUD: string;
      CLOUDENARY_SECRET: string;
    };
    DBClient: DBClient;
    mongo: FastifyMongoObject & FastifyMongoNestedObject;
    jwt: JWT;
    userID: string;
    io: Socket;
    cloudinary: typeof Cloudinary.v2;
  }

  interface FastifyRequest {
    //  this userId only avilable for routes (or plugins ) under private.plugin.ts after routes are
    // successfully authorized
    userId: string;

    // companyId is avilable under company_admin.plugin.ts
    companyId: string;
  }

  interface RouteShorthandOptions {
    websocket?: boolean;
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
