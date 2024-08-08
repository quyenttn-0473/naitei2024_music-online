import { bucket } from '../config/firebase.config';

export const uploadFileToFirebase = async (
  file: Buffer,
  originalName: string,
  folder: string,
  contentType: string
): Promise<string> => {
  const fileName = `${folder}/${Date.now()}_${originalName}`;
  const fileUpload = bucket.file(fileName);

  try {
    await fileUpload.save(file, { contentType: contentType });
    await fileUpload.makePublic();
    return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
  } catch (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw new Error('Error uploading file');
  }
};
