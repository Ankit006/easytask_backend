import { FastifyInstance } from "fastify";
import { HttpStatus, zodErrorFormatter } from "../../../utils";
import { ObjectId } from "@fastify/mongodb";
import { ICompany, NotificationType } from "../../../database/database.schema";

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
