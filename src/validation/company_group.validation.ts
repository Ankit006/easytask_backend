import { ObjectId } from "@fastify/mongodb";
import { z } from "zod";

export const CreateCompanyGroupPostValidation = z.object({
  name: z.string(),
});

export const assignMemberToGroupPutValidation = z.object({
  groupId: z.string().refine((data) => ObjectId.isValid(data), {
    message: "Please provide correct group id",
  }),
  memberId: z.string().refine((data) => ObjectId.isValid(data), {
    message: "Please provide correct memeber id",
  }),
});
