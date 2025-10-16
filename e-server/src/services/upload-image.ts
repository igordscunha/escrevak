import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImage = (fileBuffer: Buffer): Promise<UploadApiResponse> => {

  return new Promise((resolve, reject) => {

    const uploadStream = cloudinary.uploader.upload_stream(

      { folder: 'articles_escrevak' },
      (error, result) => {
        if (error) { reject(error); } 
        else if (result) { resolve(result); }
      },
      
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);

  });
};