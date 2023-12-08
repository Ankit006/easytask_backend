import { FastifyInstance } from "fastify";
import Cloudinary from "cloudinary";

const cloudinary = Cloudinary.v2;

export default function cloudinaryConfig(fastifyInstance: FastifyInstance) {
  cloudinary.config({
    secure: true,
    cloud_name: fastifyInstance.envConfig.CLOUDENARY_CLOUD,
    api_secret: fastifyInstance.envConfig.CLOUDENARY_SECRET,
    api_key: fastifyInstance.envConfig.CLOUDENARY_API_KEY,
  });
  return cloudinary;
}
