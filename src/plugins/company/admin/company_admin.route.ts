import { FastifyInstance } from "fastify";
import { companyMemberAssignBodyvalidation } from "../../../validation";
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

  fastifyInstance.post("/assign-members", async function (req, reply) {
    // validate request body
    const validBody = companyMemberAssignBodyvalidation.safeParse(req.body);

    if (validBody.success) {
      //  You cannot assign admin as member ( because he/she already is a member of the company.. duh🤷‍♀️).
      // that's why below code check if member id is equal to the logged in user Id (logged in user id is the admin, because this
      // api can only be access by the company admin)
      validBody.data.memberId === `${req.userId}` &&
        reply
          .status(HttpStatus.UNPROCESSABLE_ENTITY)
          .send({ error: "Company Admin cannot be assign as member" });

      // Fetch company data to check if the member array already contains memberId.
      const companyData =
        await this.DBClient.companyCollection().findOne<ICompany>({
          _id: new ObjectId(req.companyId),
        });

      if (
        companyData &&
        companyData.members.includes(validBody.data.memberId)
      ) {
        return reply
          .status(HttpStatus.CONFLICT)
          .send({ error: "This user already member of this company" });
      }

      // send a notification to the user
      const newNotification: NotificationType = {
        type: "CONFIRMATION",
        message: "Do you want to join this company?",
        links: {
          accept: "",
          decline: "",
        },
        isViewed: false,
        userId: new ObjectId(),
        companyId: new ObjectId(),
      };

      // Now insert memberId to the company members array
      const res = await this.DBClient.companyCollection().updateOne(
        { _id: new ObjectId(req.companyId) },
        {
          $push: { members: validBody.data.memberId },
        }
      );

      res.acknowledged
        ? reply
            .status(HttpStatus.SUCCESS)
            .send({ message: "Member successfully added" })
        : reply.status(HttpStatus.BAD_GATEWAY).send({
            message: "Sorry, its looks like there are some issue in database",
          });
    } else {
      reply
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .send(zodErrorFormatter(validBody.error.errors));
    }
  });
}
