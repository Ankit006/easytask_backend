import { z } from "zod";
import { SignUpBodySchema } from "../validation";
import { ObjectId } from "@fastify/mongodb";

export type UserType = z.infer<typeof SignUpBodySchema> & {
  _id: ObjectId;
  isActive: boolean;
};
