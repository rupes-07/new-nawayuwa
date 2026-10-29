import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Initialize Firestore using the provisioned custom database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup, firebaseSignOut };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Sync user profile to Firestore database
 */
export async function syncUserProfileToDatabase(user: {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  province?: string;
  district?: string;
  localLevel?: string;
  ward?: string;
  preferredLanguage?: 'ne' | 'en';
  onboardingCompleted?: boolean;
  avatar?: string;
}) {
  const userRef = doc(db, 'users', user.id);
  try {
    const existingSnap = await getDoc(userRef);
    if (!existingSnap.exists()) {
      await setDoc(userRef, {
        id: user.id,
        name: user.name || 'Nawa Yuwa Member',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'member',
        province: user.province || '',
        district: user.district || '',
        localLevel: user.localLevel || '',
        ward: user.ward || '',
        preferredLanguage: user.preferredLanguage || 'ne',
        onboardingCompleted: Boolean(user.onboardingCompleted),
        volunteerHours: 0,
        avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      await updateDoc(userRef, {
        name: user.name || existingSnap.data()?.name,
        email: user.email ?? existingSnap.data()?.email,
        phone: user.phone ?? existingSnap.data()?.phone,
        province: user.province ?? existingSnap.data()?.province,
        district: user.district ?? existingSnap.data()?.district,
        localLevel: user.localLevel ?? existingSnap.data()?.localLevel,
        ward: user.ward ?? existingSnap.data()?.ward,
        preferredLanguage: user.preferredLanguage ?? existingSnap.data()?.preferredLanguage,
        onboardingCompleted: user.onboardingCompleted ?? existingSnap.data()?.onboardingCompleted,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${user.id}`);
  }
}

/**
 * Retrieve user profile directly from Firestore database
 */
export async function getUserProfileFromDatabase(userId: string) {
  const userRef = doc(db, 'users', userId);
  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;
    return snap.data();
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${userId}`);
  }
}
