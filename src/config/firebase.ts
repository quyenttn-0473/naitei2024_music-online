import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../serviceAccountKey.json';

dotenv.config();

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: process.env.STORAGE_BUCKET, // Replace with your Firebase Storage bucket
});

const bucket = admin.storage().bucket();

// Export configuration and bucket
export const firebaseConfig = {
  apiKey: process.env.API_KEY!,
  authDomain: process.env.AUTH_DOMAIN!,
  projectId: process.env.PROJECT_ID!,
  databaseURL: process.env.FIRESTORE_DB_URL!,
  storageBucket: process.env.STORAGE_BUCKET!,
  messagingSenderId: process.env.MESSAGING_SENDER_ID!,
  appId: process.env.APP_ID!,
  measurementId: process.env.MEASUREMENT_ID!,
};

export { bucket };
