import { seedUsers } from './users';
import { usersCol } from './admin';
import { batchUp, commitBatches } from './batch';

async function seedUsersForFirestore() {
  const createdUsers = await seedUsers();
  const batches = batchUp({ 
    colRef: usersCol, 
    indexKey: 'uid',
    arrayData: createdUsers,
  });
  return commitBatches(batches);
}

seedUsersForFirestore().then(console.log);
