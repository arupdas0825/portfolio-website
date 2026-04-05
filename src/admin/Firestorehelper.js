// src/admin/firestoreHelper.js
// Wrapper with clear error messages for Firestore operations

import { db } from '../firebase';
import { doc, getDoc, setDoc, collection, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

const RULES_MSG = `❌ Permission denied.

Fix: Go to Firebase Console → Firestore → Rules → paste this:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

Then click Publish.`;

export async function safeGetDoc(path, id) {
  try {
    const snap = await getDoc(doc(db, path, id));
    return { data: snap.exists() ? snap.data() : null, error: null };
  } catch(e) {
    const msg = e.code === 'permission-denied' ? RULES_MSG : '❌ ' + e.message;
    return { data: null, error: msg };
  }
}

export async function safeSetDoc(path, id, data) {
  try {
    await setDoc(doc(db, path, id), data, { merge: true });
    return { error: null };
  } catch(e) {
    const msg = e.code === 'permission-denied' ? RULES_MSG : '❌ ' + e.message;
    return { error: msg };
  }
}

export async function safeAddDoc(path, data) {
  try {
    const ref = await addDoc(collection(db, path), data);
    return { id: ref.id, error: null };
  } catch(e) {
    const msg = e.code === 'permission-denied' ? RULES_MSG : '❌ ' + e.message;
    return { id: null, error: msg };
  }
}

export async function safeUpdateDoc(path, id, data) {
  try {
    await updateDoc(doc(db, path, id), data);
    return { error: null };
  } catch(e) {
    const msg = e.code === 'permission-denied' ? RULES_MSG : '❌ ' + e.message;
    return { error: msg };
  }
}

export async function safeDeleteDoc(path, id) {
  try {
    await deleteDoc(doc(db, path, id));
    return { error: null };
  } catch(e) {
    const msg = e.code === 'permission-denied' ? RULES_MSG : '❌ ' + e.message;
    return { error: msg };
  }
}

export function safeOnSnapshot(path, callback, onError) {
  return onSnapshot(
    collection(db, path),
    snap => callback(snap),
    err => {
      if (onError) {
        const msg = err.code === 'permission-denied' ? RULES_MSG : '❌ ' + err.message;
        onError(msg);
      }
    }
  );
}