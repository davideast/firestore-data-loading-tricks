import { initializeApp } from 'firebase/app';
import { getFirestore, collection, connectFirestoreEmulator, query, limit } from 'firebase/firestore';
import { collection as collection$ } from 'rxfire/firestore';
import { config } from './config';
import { fromEvent, map, mergeMap, startWith } from 'rxjs';

type User = { id: string; first_name: string, last_name: string }

const firebaseApp = initializeApp(config.firebase);
const db = getFirestore(firebaseApp);
if(location.hostname === 'localhost') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

const usersCol = collection(db, 'users');
const userList = document.querySelector('#userList');
const txtRecords = document.querySelector('#txtRecords');

const change$ = fromEvent(txtRecords, 'change').pipe(map(event => {
  // This is lazy
  return document.querySelector<HTMLInputElement>('#txtRecords').value
}));
const createUsersFrag = usersQuery => collection$(usersQuery).pipe(
  map(snapshot => { 
    const users = snapshot.map(d => ({ ...d.data(), id: d.id })) as User[];
    const documentFragment = document.createDocumentFragment();
    users.forEach(user => {
      const li = document.createElement('li');
      li.textContent = `${user.first_name} ${user.last_name}`;
      li.id = user.id;
      documentFragment.appendChild(li);
    });
    return documentFragment;
  })
);

change$.pipe(
  startWith('10'),
  mergeMap(recordNumber => {
    const number = parseInt(recordNumber, 10);
    const obs$ = createUsersFrag(query(usersCol, limit(number)));
    return obs$;
  })
).subscribe(frag => {
  userList.innerHTML = '';
  userList.appendChild(frag);
});

