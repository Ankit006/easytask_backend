import { ObjectId } from "@fastify/mongodb";
import { z } from "zod";

export const validateCompanyJoinData = z.object({
  companyId: z.string().refine((data) => ObjectId.isValid(data), {
    message: "Not a valid user id",
  }),
  notificationId: z.string(),
});
