import { ObjectId } from "@fastify/mongodb";
import { z } from "zod";
import { companyBodyValidation } from "../validation";

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
}

export interface IJoinRequestNotification {
  _id: string;
  type: "JOIN_REQUEST";
  companyDetail: {
    companyId: string;
    companyLogo: null | ImageStore;
    companyName: string;
  };
  timestamp: string;
}

export interface IGroup {
  _id: ObjectId;
  name: string;
  companyId: string;
  members: [];
}

interface IProjectTask {
  memberId: string;
  task: string;
  completed: boolean;
  referMember: [
    {
      text: string;
      memberId: string;
    }
  ];
}

export interface IProjectSprint {
  _id: ObjectId;
  projectId: string;
  sprintIndex: number;
  sprintStartDate: string;
  sprintEndDate: string;
  tasks: IProjectTask[];
}

export interface IProject {
  _id: ObjectId;
  name: string;
  companyId: string;
  projectDesc: string;
  projectCost: string;
  projectDeadLine: string;
}
