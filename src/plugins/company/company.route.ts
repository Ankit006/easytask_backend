import { FastifyInstance } from "fastify";
import { companyBodyValidation } from "../../validation";
import {
  HttpStatus,
  mongoErrorFormatter,
  zodErrorFormatter,
} from "../../utils";
import { CompanyType, ImageStore } from "../../database/database.schema";
import { CompanyFileFormValidation } from "./validation";
export function companyRoutes(fastifyInstance: FastifyInstance) {
  /////////////////////// fastify multipart /////////////////////////////
  fastifyInstance.register(require("@fastify/multipart"), {
    limits: {
      fileSize: 3000000,
      fields: 10,
    },
    attachFieldsToBody: true,
  });

  fastifyInstance.get("/", async function (request, reply) {
    try {
      const companyList = await this.DBClient.companyCollection()
        .find<CompanyType>({
          adminId: request.userId,
        })
        .toArray();
      return reply.send(companyList);
    } catch (err) {
      return reply
        .status(HttpStatus.BAD_GATEWAY)
        .send({ error: "Oops, its looks like there are server issues😟" });
    }
  });

  fastifyInstance.post("/", async function (req, reply) {
    // data will be undefiled if user not send any file

    const validatedBody = CompanyFileFormValidation.safeParse(req.body);

    if (validatedBody.success) {
      try {
        let logo: ImageStore = null;
        if (validatedBody.data.file) {
          const buffer = await validatedBody.data.file.toBuffer();
          const res = await this.imageStorage.uploadImage(
            buffer,
            validatedBody.data.file.filename
          );
          logo = {
            fileId: res.fileId,
            url: res.url,
          };
        }
        const companyData: Partial<CompanyType> = {
          name: validatedBody.data.name.value,
          adminId: req.userId,
          logo,
          pinCode: validatedBody.data.pinCode.value,
          members: [],
          country: validatedBody.data.country.value,
          address: validatedBody.data.address.value,
        };
        await this.DBClient.companyCollection().insertOne(companyData);
        reply.status(HttpStatus.CREATED).send(companyData);
      } catch (err) {
        return reply
          .status(HttpStatus.BAD_GATEWAY)
          .send(mongoErrorFormatter(err));
      }
    } else {
      return reply
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: "Cannot read the form data" });
    }
    // if (data) {
    //   const file = data.file;
    //   const fields = data.fields;
    //   const validCompanyData = companyBodyValidation.safeParse(fields);

    //   if (validCompanyData.success) {
    //     try {
    //       let logoPublicId: string | null = null;

    //       const companyObj: Partial<CompanyType> = {
    //         ...validCompanyData.data,
    //         adminId: req.userId,
    //         members: [],
    //         logoPublicId,
    //       };

    //       await this.DBClient.companyCollection().insertOne(companyObj);
    //       return reply.status(HttpStatus.CREATED).send({
    //         message: "New company added successfuly",
    //         company: companyObj,
    //       });
    //     } catch (err) {
    //       return reply.status(HttpStatus.BAD_GATEWAY).send({
    //         error: "Oops, its looks like there are server issues😟",
    //       });
    //     }
    //   } else {
    //     return reply
    //       .status(HttpStatus.UNPROCESSABLE_ENTITY)
    //       .send(zodErrorFormatter(validCompanyData.error.errors));
    //   }
    // } else {
    //   return reply
    //     .status(HttpStatus.BAD_REQUEST)
    //     .send({ error: "Cannot read the form data" });
    // }

    // If data is undefined than that means user is sending a JSON data
  });
}
