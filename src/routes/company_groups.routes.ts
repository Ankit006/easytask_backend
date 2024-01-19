import { FastifyInstance } from "fastify";
import {
  CreateCompanyGroupPostValidation,
  assignMemberToGroupPutValidation,
} from "../validation/company_group.validation";
import { HttpStatus, mongoErrorFormatter, zodErrorFormatter } from "../utils";
import { IGroup } from "../database/database.schema";
import { ObjectId } from "@fastify/mongodb";
import { request } from "http";

export default function companyGroupRoutes(fastify: FastifyInstance) {
  fastify.post("/group", async function (request, reply) {
    const validatedData = CreateCompanyGroupPostValidation.safeParse(
      request.body
    );
    if (validatedData.success) {
      const groupBody: Partial<IGroup> = {
        name: validatedData.data.name,
        companyId: request.companyId,
        members: [],
      };
      try {
        await this.DBClient.groupCollection().insertOne(groupBody);
        return reply
          .status(HttpStatus.CREATED)
          .send({ message: "New grop added" });
      } catch (err) {
        return reply
          .status(HttpStatus.BAD_GATEWAY)
          .send(mongoErrorFormatter(err));
      }
    } else {
      return reply
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: "Wrong information provided" });
    }
  });

  fastify.get("/group", async function (request, reply) {
    try {
      const res = this.DBClient.groupCollection().find<IGroup>(
        {
          companyId: request.companyId,
        },
        { projection: { members: 0 } }
      );
      const groupList: IGroup[] = [];
      for await (const group of res) {
        groupList.push(group);
      }
      return reply.status(HttpStatus.SUCCESS).send(groupList);
    } catch (err) {
      return reply
        .status(HttpStatus.BAD_GATEWAY)
        .send(mongoErrorFormatter(err));
    }
  });

  fastify.delete("/group/delete/:groupId", async function (request, reply) {
    const { groupId } = request.params as { groupId: string };
    try {
      const res = await this.DBClient.groupCollection().deleteOne({
        _id: new ObjectId(groupId),
      });
      return reply
        .status(HttpStatus.SUCCESS)
        .send({ message: "Group is removed" });
    } catch (err) {
      return reply
        .status(HttpStatus.BAD_GATEWAY)
        .send(mongoErrorFormatter(err));
    }
  });

  fastify.put("/group/member", async function (request, reply) {
    const validData = assignMemberToGroupPutValidation.safeParse(request.body);

    if (!validData.success) {
      return reply
        .status(HttpStatus.BAD_REQUEST)
        .send(zodErrorFormatter(validData.error.errors));
    }

    try {
      // check if the member is the member of the current company
      const member = await this.DBClient.membersCollection().findOne({
        companyId: request.companyId,
        userId: validData.data.memberId,
      });

      if (!member) {
        return reply
          .send(HttpStatus.NOT_FOUND)
          .send({ error: "User is not a member of this company" });
      }

      // now we push the memberId into the members array in group document
      await this.DBClient.groupCollection().updateOne(
        { _id: new ObjectId(validData.data.groupId) },
        { $push: { members: validData.data.memberId } }
      );
      return reply
        .status(HttpStatus.SUCCESS)
        .send({ message: "Group is assigned to the memeber" });
    } catch (err) {
      return reply
        .status(HttpStatus.BAD_GATEWAY)
        .send(mongoErrorFormatter(err));
    }
  });

  fastify.put("/group/member/remove", async (request, reply) => {
    const validData = assignMemberToGroupPutValidation.safeParse(request.body);

    if (!validData.success) {
      return reply
        .status(HttpStatus.BAD_REQUEST)
        .send(zodErrorFormatter(validData.error.errors));
    }
  });
}
