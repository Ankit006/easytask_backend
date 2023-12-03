import { FastifyInstance } from "fastify";
import { SignUpBodySchema, loginBodyValidation } from "../../validation";
import { UserType } from "../../database/database.schema";
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
        await fastifyInstance.DBClient.userCollection().findOne<UserType>({
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
        // Generate user object (this method also handle password hashing adding it to the new user object)
        const userData = await this.DBClient.generateUserObject(
          validUserData.data
        );

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
