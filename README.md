# Loading more data with Firestore

This is a simple example of loading more data with Firestore and RxJS. You don't need to use RxJS, but it's nice in this case.

**Status:** Looking to improve this over time.

## Instructions
This project works against the Firebase Emulator Suite with sample data provided. Clone the project and run the following steps:

```bash
npm i
npm run dev
```

Open up your browser to the port Vite runs on (usually `localhost:3000`) and also check out the Emulator UI running on `localhost:4000`.

## The use case
Out of a 100 possible users, render a list from the first to `N`. `N` being the number of users determined by a textbox.

### How does this fetch data?
The Firestore JavaScript SDK has an underyling cache that only retrieves documents again if a sync is needed. If you use `onSnapshot()`, it works against the underlying cache. If you wrote two competing `onSnapshot()` functions, they would both work against the same cache. Therefore there wouldn't be any duplication of data fetching.

```js
onSnapshot(usersCol, snapshot => {
  // Just reading from the cache!
})

onSnapshot(usersCol, snapshot => {
  // I too, am just reading from the cache!
})
```
