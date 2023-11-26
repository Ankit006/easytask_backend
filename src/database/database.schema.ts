import { z } from "zod";
import { SignUpBodySchema, companyBodyValidation } from "../validation";
import { ObjectId } from "@fastify/mongodb";

export type UserType = z.infer<typeof SignUpBodySchema> & {
  _id: ObjectId;
  isActive: boolean;
};

export type CompanyType = z.infer<typeof companyBodyValidation> & {
  _id: ObjectId;
  adminId: string;
  members: string[];
};
