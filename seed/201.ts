
import { seedUsersForFirestore } from './users';
import { seedExpensesInlineUid } from './expenses';

async function seedUsersAndExpensesForFirestore() {
  const allUsers = await seedUsersForFirestore();
  return seedExpensesInlineUid(allUsers);
}

seedUsersAndExpensesForFirestore().then(console.log);
