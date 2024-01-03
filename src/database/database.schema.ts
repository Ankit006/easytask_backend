import { z } from "zod";
import { SignUpBodySchema, companyBodyValidation } from "../validation";
import { ObjectId } from "@fastify/mongodb";

export interface IUser {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  phoneNumber: string;
  password: string;
  isActive: boolean;
  profilePic: ImageStore | null;
}

export interface ImageStore {
  url: string;
  fileId: string;
}

export interface ICompany extends z.infer<typeof companyBodyValidation> {
  _id: ObjectId;
  logo: ImageStore | null;
}

export interface IMember {
  _id: ObjectId;
  userId: string;
  companyId: string;
  role: "Admin" | "Member";
  designation: string[];
}

export interface IJoinRequestNotification {
  type: "JOIN_REQUEST";
  companyDetail: {
    companyLogo: null | ImageStore;
    companyName: string;
  };
  buttonAction: {
    accept: string;
    cancel: string;
  };
  timestamp: string;
}
