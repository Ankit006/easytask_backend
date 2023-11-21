import { FastifyInstance } from "fastify";

export function authRoutes(fastifyInstance: FastifyInstance) {
  fastifyInstance.get("/", async function (req, res) {
    const token = fastifyInstance.jwt.sign({ name: "user" });
    res
      .setCookie("auth", token, {
        httpOnly: true,
        maxAge: 60 * 60,
        secure: true,
      })
      .send("A cookie is set");
  });
}
