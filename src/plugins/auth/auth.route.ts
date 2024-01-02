import { FastifyInstance } from "fastify";
import { SignUpBodySchema, loginBodyValidation } from "../../validation";
import { IUser, ImageStore } from "../../database/database.schema";
import argon2 from "argon2";
import {
  HttpStatus,
  mongoErrorFormatter,
  zodErrorFormatter,
} from "../../utils";

export function authRoutes(fastifyInstance: FastifyInstance) {
  // Signin user
  fastifyInstance.post("/signin", async function (req, reply) {
    const validUserData = loginBodyValidation.safeParse(req.body);
    if (validUserData.success) {
      // get the user from database
      const user =
        await fastifyInstance.DBClient.userCollection().findOne<IUser>({
          email: validUserData.data.email,
        });
      // Check if user exist
      if (user) {
        // validate password
        const validatePass = await argon2.verify(
          user.password,
          validUserData.data.password
        );

        if (validatePass) {
          reply
            .status(HttpStatus.SUCCESS)
            .send({ mesasge: "Login successful", user });
        } else {
          return reply
            .status(HttpStatus.NOT_FOUND)
            .send({ error: "Please provide correct email or password" });
        }
      } else {
        return reply
          .status(HttpStatus.NOT_FOUND)
          .send({ error: "Please provide correct email or password" });
      }
    } else {
      return reply
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .send(zodErrorFormatter(validUserData.error.errors));
    }
  });

  //////////////////////////////////////////////////// Create user route //////////////////////////////////////////////////////////

  fastifyInstance.post("/signup", async function (request, reply) {
    // validate user body
    const validUserData = SignUpBodySchema.safeParse(request.body);
    if (validUserData.success) {
      try {
        // check if user with this email already exist (because email must be unique)
        const user = await this.DBClient.userCollection().findOne({
          email: validUserData.data.email.value,
        });
        if (user) {
          return reply
            .status(HttpStatus.CONFLICT)
            .send({ error: "A user with this email already exist" });
        }

        let logo: ImageStore | null = null;

        if (validUserData.data.file) {
          const buffer = await validUserData.data.file.toBuffer();
          const res = await this.imageStorage.uploadImage(
            buffer,
            validUserData.data.file.filename,
            "userProfilePic"
          );
          logo = {
            fileId: res.fileId,
            url: res.url,
          };
        }
        const hashedPassword = await argon2.hash(
          validUserData.data.password.value
        );

        const userData: Partial<IUser> = {
          firstName: validUserData.data.firstName.value,
          lastName: validUserData.data.lastName.value,
          age: validUserData.data.age.value,
          email: validUserData.data.email.value,
          password: hashedPassword,
          phoneNumber: validUserData.data.phoneNumber.value,
          isActive: true,
          profilePic: logo,
        };
        // inserting new user object to user coolection
        await fastifyInstance.DBClient.userCollection().insertOne(userData);
        delete userData.password;
        reply
          .status(HttpStatus.CREATED)
          .send({ mesasge: "Account created successfuly", user: userData });
      } catch (err: any) {
        return reply
          .status(HttpStatus.BAD_GATEWAY)
          .send(mongoErrorFormatter(err));
      }
    } else {
      return reply
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .send(zodErrorFormatter(validUserData.error.errors));
    }
  });
}
