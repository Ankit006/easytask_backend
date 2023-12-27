import { FastifyInstance } from "fastify";
import ImageKit from "imagekit";

export class ImageStorage {
  private imageKit: ImageKit;
  constructor(fastify: FastifyInstance) {
    const imageKit = new ImageKit({
      privateKey: fastify.envConfig.IMAGEKIT_PRIVATE_KEY,
      publicKey: fastify.envConfig.IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: fastify.envConfig.IMAGEKIT_URL_ENDPOINT,
    });
    this.imageKit = imageKit;
  }

  uploadImage(file: any, fileName: string, folderName: string) {
    return this.imageKit.upload({
      file: file,
      folder: folderName,
      fileName: fileName,
    });
  }
}
