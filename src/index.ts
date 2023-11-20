import Fastify from "fastify";
import registeredPlugIn from "./main.plugin";

const fastify = Fastify({ logger: true });

// plugins
registeredPlugIn(fastify);

async function main() {
  try {
    await fastify.listen({ port: 4000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
