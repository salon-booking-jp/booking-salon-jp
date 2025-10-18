import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function signUp(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'salons', user.uid), {
      ownerId: user.uid,
      email: email,
      name: '',
      phone: '',
      address: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return user;
  } catch (error) {
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw error;
  }
}

export function getCurrentUser(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}