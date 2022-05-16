import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
const serviceAccount = require('./sa.json');
import { MockUser, CreatedUser } from './types';

export const firebaseApp = initializeApp({
  credential: cert(serviceAccount)
});

export const firestore = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const usersCol = firestore.collection('users');
export const expensesCol = firestore.collection('expenses');

export async function createUsers(usersArray: MockUser[]) {
  let users = [] as CreatedUser[];
  for await (const user of usersArray) {
    const userRecord = await auth.createUser({
      email: user.email,
      emailVerified: true,
      displayName: `${user.first} ${user.last}`,
      disabled: false,
    });
    users = [...users, { ...user, uid: userRecord.uid }]
  }
  return users;
}
