import cloudinary from './cloudinary';
import { UploadApiResponse } from 'cloudinary';

// Upload image function
export const uploadImage = async (fileBuffer: Buffer, folderName: string, resourceType: 'image' | 'raw' = 'raw'): Promise<string> => {
  try {
    // Upload image to Cloudinary
    const result: UploadApiResponse | undefined = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: folderName,  resource_type: resourceType }, // Specify the folder name
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      ).end(fileBuffer); // Upload the buffer
    });

    // If successful, return the secure URL
    if (result && result.secure_url) {
      return result.secure_url;
    } else {
      throw new Error('Failed to upload image');
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};
