import { ObjectId } from "@fastify/mongodb";
import { FastifyInstance } from "fastify";
import { IGroup, IMember, IUser } from "../database/database.schema";
import { HttpStatus, mongoErrorFormatter } from "../utils";

/**
 *  Only admin can access this routes. This Routes enable admin to perform various member related work such as get list of members and assign members in different groups
 */
export default function companyAdminMemberRoute(fastify: FastifyInstance) {
  // return list of members of the current company
  fastify.get("/members", async function (request, reply) {
    try {
      const memberList = this.DBClient.membersCollection().find<IMember>(
        {
          companyId: request.companyId,
          userId: { $ne: request.userId },
        },
        { projection: { password: 0 } }
      );
      const profileList: IUser[] = [];
      for await (const member of memberList) {
        const user = await this.DBClient.userCollection().findOne<IUser>({
          _id: new ObjectId(member.userId),
        });
        user && profileList.push(user);
      }
      return reply.status(HttpStatus.SUCCESS).send(profileList);
    } catch (err) {
      return reply
        .status(HttpStatus.BAD_GATEWAY)
        .send(mongoErrorFormatter(err));
    }
  });

  fastify.get("/member/:memberId", async function (request, reply) {
    const { memberId } = request.params as { memberId: string };

    try {
      // check if the user is the member of the current company
      const member = await this.DBClient.membersCollection().findOne<IMember>({
        userId: memberId,
        companyId: request.companyId,
      });
      if (!member) {
        return reply
          .status(HttpStatus.NOT_FOUND)
          .send({ error: "No user found" });
      }
      // fetch user data
      const user = await this.DBClient.userCollection().findOne<IUser>(
        {
          _id: new ObjectId(memberId),
        },
        { projection: { password: 0 } }
      );

      if (!user) {
        return reply
          .status(HttpStatus.NOT_FOUND)
          .send({ error: "No user found" });
      }

      // fetch user groups
      const groupList: IGroup[] = [];
      const groups = this.DBClient.groupCollection().find<IGroup>(
        {
          members: memberId,
        },
        { projection: { members: 0 } }
      );
      for await (const group of groups) {
        groupList.push(group);
      }

      // create response object;

      const resultObj = {
        ...user,
        groupList,
      };
      return reply.status(HttpStatus.SUCCESS).send(resultObj);
    } catch (err) {
      return reply
        .status(HttpStatus.BAD_GATEWAY)
        .send(mongoErrorFormatter(err));
    }
  });
}
