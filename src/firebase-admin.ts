import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

let app;

if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(firebaseAdminConfig as Parameters<typeof cert>[0]),
  });
}

export const adminDb = getFirestore(app);