import { expensesCol } from './admin';
import { batchUp, commitBatches } from './batch';
import { CreatedExpense } from './types';
import { convertMockarooData, getRandomInt } from './util';
const expensesMockData = require('./data/expenses.json');
const categoriesData: string[] = require('./data/categories.json');

export async function seedExpensesInlineUid(users: Partial<{ uid: string }[]>, limit = 5000) {
  const expenses = convertMockarooData<CreatedExpense>(expensesMockData, expense => {
    if(expense.date != null) {
      expense.date = new Date(expense.date);
    }
    expense.uid = users[getRandomInt(0, users.length - 1)].uid;
    const categoryOne = expense.category as any;
    const categoryTwo = categoriesData[getRandomInt(0, categoriesData.length - 1)];
    let categories = categoryOne === categoryTwo ? [categoryOne] : [categoryOne, categoryTwo];
    expense.categories = categories;
    return expense;
  }).slice(0, limit);

  const batches = batchUp({
    arrayData: expenses,
    colRef: expensesCol,
  });

  await commitBatches(batches);
  return expenses;
}
