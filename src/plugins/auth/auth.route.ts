import { FastifyInstance } from "fastify";
import { SignUpBodySchema, loginBodyValidation } from "../../validation";
import { UserType } from "../../database/database.schema";
import argon2 from "argon2";
import { HttpStatus, zodErrorFormatter } from "../../utils";

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
          // generate a new jwt token
          const token = fastifyInstance.jwt.sign({ userId: user._id });

          // set Cookie and send response
          reply
            .setCookie("auth", token, {
              httpOnly: true,
              maxAge: 60 * 60,
              secure: true,
            })

            .status(HttpStatus.CREATED)
            .send({ mesasge: "Login successful" });
        } else {
          return reply
            .status(HttpStatus.NOT_FOUND)
            .send({ message: "Please provide correct email or password" });
        }
      } else {
        return reply
          .status(HttpStatus.NOT_FOUND)
          .send({ message: "Please provide correct email or password" });
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
        // Generate user object (this method also handle password hashing adding it to the new user object)
        const userData = await this.DBClient.generateUserObject(
          validUserData.data
        );

        // inserting new user object to user coolection
        const res = await fastifyInstance.DBClient.userCollection().insertOne(
          userData
        );

        // generate jwt token and the payload is user objectId
        const token = fastifyInstance.jwt.sign({ userId: res.insertedId });

        // set JWT to the HTTPOnly cookie and send response
        reply
          .setCookie("auth", token, {
            httpOnly: true,
            maxAge: 60 * 60,
            secure: true,
          })

          .status(HttpStatus.CREATED)
          .send({ mesasge: "Account created successfuly" });
      } catch (err) {
        return reply
          .status(HttpStatus.BAD_GATEWAY)
          .send({ error: "There are some issue with database" });
      }
    } else {
      return reply
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .send(zodErrorFormatter(validUserData.error.errors));
    }
  });
}
