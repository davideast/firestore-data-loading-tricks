
import { seedUsersForFirestore } from './users';
import { seedExpensesInlineUid } from './expenses';
import { expensesCol } from './admin';

async function seedUsersAndExpensesForFirestore() {
  const allUsers = await seedUsersForFirestore();
  return seedExpensesInlineUid(allUsers);
}

// seedUsersAndExpensesForFirestore().then(console.log);

async function getExpensesFor(uid: string, lessThan: number) {
  expensesCol.firestore.collectionGroup('')
  // /expenses/{uid}/2021_01/{expenseId}
  // /users/{uid}/expenses/{expenseId}
  // /expenses/{uid}/1-2021/{expenseId}

  // db.collectionGroup('expenses')
  // db.collectionGroup('landmarks').where('type', '==', 'museum');

  const expenseQuery = expensesCol
    .where('uid', '==', uid)
    .where('categories', 'not-in', ['fun', 'kids'])
    // .where('category', 'not-in', ['fun', 'pets', 'kids', 'insurance', 'utilities', 'taxes', 'healthcare', 'gifts', 'personal', 'home']);
    // .where('date', '>', new Date('2021-08-02'))
    // .where('date', '<', new Date('2021-09-02'))
  const snapshot = await expenseQuery.get();
  return snapshot.docs.map(d => ({ id: d.id, ...d.data(), date: d.data().date.toDate() }));
}

getExpensesFor('DxEVRtd1c5r3V1u5SN547h56IZWm', 100).then(console.log);
