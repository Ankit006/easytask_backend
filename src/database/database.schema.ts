import { z } from "zod";
import { SignUpBodySchema, companyBodyValidation } from "../validation";
import { ObjectId } from "@fastify/mongodb";

export interface IUser extends z.infer<typeof SignUpBodySchema> {
  _id: ObjectId;
  isActive: boolean;
}

export interface ImageStore {
  url: string;
  fileId: string;
}

export interface ICompany extends z.infer<typeof companyBodyValidation> {
  _id: ObjectId;
  adminId: string;
  members: string[];
  logo: ImageStore | null;
}

export interface NotificationType {
  type: "CONFIRMATION" | "MESSAGE";
  message: string;

  // links attribute is for CONFIRMATION notification, for MESSAGE it will be null
  links: {
    accept: string;
    decline: string;
  } | null;

  // isViewed indicate that if the current notification is viewed by the user. By default the value is false
  isViewed: boolean;
  userId: ObjectId;
  companyId: ObjectId;
}
