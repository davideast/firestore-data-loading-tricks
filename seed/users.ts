import { createUsers } from './admin'
import { convertMockarooData } from './util'
import type { MockUser } from './types'
import { request } from 'http'
const userData = require('./data/users.json');
const serviceAccount = require('./sa.json');

export async function seedUsers() {
  const mockUsers = convertMockarooData<MockUser>(userData, (user) => {
    if (user.birthday) {
      user.birthday = new Date(user.birthday)
    }
    return user
  })
  return createUsers(mockUsers)
}

export async function deleteAllUsers() {
  return new Promise((resolve, reject) => {
    request(
      `http://localhost:9099/emulator/v1/projects/${serviceAccount.project_id}/accounts`,
      { method: 'DELETE' },
      (res) => {
        let chunks: any[] = []
        res.on('data', chunk => {
          chunks = [...chunks, chunk];
        });
        res.on('end', () => {
          const message = Buffer.concat(chunks).toString();
          resolve(message);
        })
      },
    )
  });
}
