import { FastifyInstance } from "fastify";

export function authRoutes(fastifyInstance: FastifyInstance) {
  fastifyInstance.get("/", async function (req, res) {
    const test = this.mongo.client.db("test_db");
    if (test) {
      console.log("changing database");
      await test.collection("test").insertOne({
        name: "Ankit",
        age: 12,
      });
    }
    return "This message is from auth route";
  });
}
