import Fastify from "fastify";
import registeredPlugIn from "./main.plugin";
import {
  FastifyMongoNestedObject,
  FastifyMongoObject,
  ObjectId,
} from "@fastify/mongodb";
import DBClient from "./database/dbClient";
import { JWT } from "@fastify/jwt";
import { Socket } from "socket.io";
import { IUser } from "./database/database.schema";
import { ImageStorage } from "./plugins/decorators/imageStorage/imageStorage";

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
      IMAGEKIT_PUBLIC_KEY: string;
      IMAGEKIT_PRIVATE_KEY: string;
      IMAGEKIT_URL_ENDPOINT: string;
    };
    DBClient: DBClient;
    mongo: FastifyMongoObject & FastifyMongoNestedObject;
    jwt: JWT;

    userID: string;
    io: Socket;
    imageStorage: ImageStorage;
  }

  interface FastifyRequest {
    //  this userId only avilable for routes (or plugins ) under private.plugin.ts after routes are
    // successfully authorized
    userId: string;
    // companyId is avilable under company_admin.plugin.ts
    companyId: string;
    memberRole: "Admin" | "Member";
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
