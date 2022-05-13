const data = require('./MOCK_DATA.json');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./sa.json');

const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);
const usersCol = db.collection('users');
const usersArray = Object.entries(data).map(arr => arr[1]).flat();

function batchUp(array, count = 0, currentBatchIndex = 0, batches = []) {
  const BATCH_SIZE = 500;
  const BATCH_LIMIT = (BATCH_SIZE * currentBatchIndex) + BATCH_SIZE;
  while(count < BATCH_LIMIT) {
    const record = array[count];
    if(batches[currentBatchIndex] == null) {
      batches[currentBatchIndex] = db.batch();
    }
    batches[currentBatchIndex].set(usersCol.doc(), record);
    count = count + 1;
    currentBatchIndex = Math.floor(count / BATCH_SIZE);
  }
  if(array.length > count) {
    return batchUp(array, count, currentBatchIndex, batches);
  }
  return batches;
}

const batches = batchUp(usersArray);

batches.forEach(b => b.commit());
