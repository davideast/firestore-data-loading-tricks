import { expensesCol } from './admin';
import { batchUp, commitBatches } from './batch';
import { CreatedExpense } from './types';
import { convertMockarooData, getRandomInt } from './util';
const expensesMockData = require('./data/expenses.json');

export async function seedExpensesInlineUid(users: Partial<{ uid: string }[]>) {
  const expenses = convertMockarooData<CreatedExpense>(expensesMockData, expense => {
    if(expense.date != null) {
      expense.date = new Date(expense.date);
    }
    expense.uid = users[getRandomInt(0, users.length - 1)].uid;
    return expense;
  });

  const batches = batchUp({
    arrayData: expenses,
    colRef: expensesCol,
  });

  await commitBatches(batches);
  return expenses;
}
