import { takeLatest, call, put, select } from 'redux-saga/effects';

// Root saga
export default function* rootSaga() {
  // if necessary, start multiple sagas at once with `all`
  yield [takeLatest(LOAD_REPOS, getRepos), takeLatest(LOAD_USERS, getUsers)];
}
