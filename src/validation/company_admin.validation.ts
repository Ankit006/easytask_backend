import { ObjectId } from "@fastify/mongodb";
import { z } from "zod";

export const searchUserValidation = z.object({
  email: z.string().email({ message: "Please provide valid email" }),
});

export const userRequestQueryValidation = z.object({
  userId: z.string().refine((value) => ObjectId.isValid(value), {
    message: "Invalid ObjectId",
  }),
});
