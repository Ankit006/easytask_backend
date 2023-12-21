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
    const validatedBody = CompanyFileFormValidation.safeParse(req.body);

    if (validatedBody.success) {
      try {
        //  check company with this name already exist or not
        const company = await this.DBClient.companyCollection().findOne({
          name: validatedBody.data.name.value.toLowerCase(),
        });
        if (company) {
          return reply
            .status(HttpStatus.CONFLICT)
            .send({ error: "A company with this name already exist" });
        }

        let logo: ImageStore | null = null;

        // if user send a company logo then save the logo in imagekit and save url and imageId
        // into logo variable
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

        // save company data and send response
        const companyData: Partial<CompanyType> = {
          name: validatedBody.data.name.value.toLowerCase(),
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
  });
}
