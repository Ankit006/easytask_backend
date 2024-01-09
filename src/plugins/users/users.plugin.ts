import { DoneFuncWithErrOrRes, FastifyInstance } from "fastify";
import { BaseOptionTypes } from "../../validation";
import { ObjectId } from "@fastify/mongodb";
import { IMember, IUser } from "../../database/database.schema";
import {
  HttpStatus,
  mongoErrorFormatter,
  zodErrorFormatter,
} from "../../utils";
import {
  validateCompanyJoinData,
  validateDeleteNotifcationQuery,
} from "./types";

export default function usersPlugin(
  fastify: FastifyInstance,
  _opts: BaseOptionTypes,
  done: DoneFuncWithErrOrRes
) {
  fastify.get("/", async function (request, reply) {
    const user = await this.DBClient.userCollection().findOne<IUser>(
      {
        _id: new ObjectId(request.userId),
      },
      { projection: { password: 0 } }
    );
    return user
      ? reply.status(HttpStatus.SUCCESS).send(user)
      : reply.status(HttpStatus.NOT_FOUND).send({ error: "user not found" });
  });

  fastify.get("/notifications", async function (request, reply) {
    const res = await this.redisCache.getAllNotification(request.userId);
    if (Array.isArray(res)) {
      return reply.status(HttpStatus.SUCCESS).send(res);
    } else {
      return reply.status(HttpStatus.SERVER_ERROR).send(res);
    }
  });

  fastify.post("/join-company", async function (request, reply) {
    const validatedData = validateCompanyJoinData.safeParse(request.body);
    if (validatedData.success) {
      const memberObj: IMember = {
        _id: new ObjectId(),
        userId: request.userId,
        companyId: validatedData.data.companyId,
        role: "Member",
        designation: [],
      };
      try {
        await this.DBClient.membersCollection().insertOne(memberObj);
        return reply
          .status(HttpStatus.SUCCESS)
          .send({ message: "You are now member to this company" });
      } catch (err) {
        return reply
          .status(HttpStatus.SERVER_ERROR)
          .send(mongoErrorFormatter(err));
      }
    } else {
      return reply
        .status(HttpStatus.BAD_REQUEST)
        .send(zodErrorFormatter(validatedData.error.errors));
    }
  });

  fastify.delete("/remove-notifcation", async function (request, reply) {
    const validateData = validateDeleteNotifcationQuery.safeParse(
      request.query
    );
    if (validateData.success) {
      const res = await this.redisCache.removeNotification(
        request.userId,
        validateData.data.notificationId
      );
      if (typeof res === "boolean") {
        return reply
          .status(HttpStatus.SUCCESS)
          .send({ message: "Notification is removed" });
      } else {
        return reply.status(HttpStatus.SERVER_ERROR).send(res);
      }
    } else {
      return reply
        .status(HttpStatus.BAD_REQUEST)
        .send(zodErrorFormatter(validateData.error.errors));
    }
  });
  done();
}
