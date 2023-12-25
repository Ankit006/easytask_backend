import { FastifyInstance } from "fastify";

import { ObjectId } from "@fastify/mongodb";
import { HttpStatus } from "../../../../../../utils";

export default function companyAdminRoute(fastifyInstance: FastifyInstance) {
  fastifyInstance.get("/", async function (req, reply) {
    const companyData = await this.DBClient.companyCollection().findOne({
      _id: new ObjectId(req.companyId),
      adminId: req.userId,
    });
    companyData
      ? reply.status(HttpStatus.SUCCESS).send(companyData)
      : reply.status(HttpStatus.NOT_FOUND).send({ error: "No Company found" });
  });
}
