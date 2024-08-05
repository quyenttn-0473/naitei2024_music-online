import { initializeApp } from 'firebase/app';
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage';
import { firebaseConfig } from '../config/firebase';

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

// Define the file data type
interface FileData {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

// Function to upload an image
const uploadImg = async (fileData: FileData): Promise<string | null> => {
  if (!fileData.buffer) {
    return null;
  }
  const dateTime = giveCurrentDateTime();
  const storageRef = ref(
    storage,
    `images/${fileData.originalname}-${dateTime}`
  );
  const metadata = {
    contentType: fileData.mimetype,
  };
  const snapshot = await uploadBytesResumable(
    storageRef,
    fileData.buffer,
    metadata
  );
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
};

// Function to get the current date and time in YYYY-MM-DD HH:MM:SS format
const giveCurrentDateTime = (): string => {
  const today = new Date();
  const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;
  const time = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}:${String(
    today.getSeconds()
  ).padStart(2, '0')}`;
  return `${date} ${time}`;
};

export { uploadImg };
