
const userData = require('../data/users.json');
const expensesData = require('../data/expenses.json');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const serviceAccount = require('../sa.json');

const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);
const auth = getAuth(app);
const usersCol = db.collection('users');
const expensesCol = db.collection('expenses');
const usersArray = Object.entries(userData).map(arr => arr[1]).flat().map(user => {
  if(user.birthday) {
    user.birthday = new Date(user.birthday);
  }
  return user;
})
const expensesArray = Object.entries(expensesData).map(arr => arr[1]).flat().map(expense => {
  if(expense.date) {
    expense.date = new Date(expense.date);
  }
  return expense;
})

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function createUsers(usersArray) {
  let users = [];
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

function createExpensesInlineUid(expensesArray, users) {
  return expensesArray.map(expense => {
    const randomIndex = getRandomInt(0, users.length - 1);
    const randomUser = users[randomIndex];
    return { ...expense, uid: randomUser.uid };
  });
}

function batchUp(indexKey, colRef, array, count = 0, currentBatchIndex = 0, batches = []) {
  const BATCH_SIZE = 500;
  const BATCH_LIMIT = (BATCH_SIZE * currentBatchIndex) + BATCH_SIZE;
  while(count < BATCH_LIMIT) {
    const record = array[count];
    const indexKeyValue = indexKey != null ? record[indexKey] : colRef.doc().id;
    if(batches[currentBatchIndex] == null) {
      batches[currentBatchIndex] = db.batch();
    }
    batches[currentBatchIndex].set(colRef.doc(indexKeyValue), record);
    count = count + 1;
    currentBatchIndex = Math.floor(count / BATCH_SIZE);
  }
  if(array.length > count) {
    return batchUp(indexKey, colRef, array, count, currentBatchIndex, batches);
  }
  return batches;
}

createUsers(usersArray)
  .then(users => {
    const expenses = createExpensesInlineUid(expensesArray, users);
    return [
      ...batchUp('uid', usersCol, users),
      ...batchUp(null, expensesCol, expenses),
    ];
  })
  .then(batches => {
    batches.forEach(b => b.commit());
  })
