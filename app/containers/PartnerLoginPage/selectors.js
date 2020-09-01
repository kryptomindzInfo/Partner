import { createSelector } from 'reselect';

const selectGlobal = state => state.get('global');

const makeSelectUsername = () =>
  createSelector(
    selectGlobal,
    global => global.get('username'),
  );

const makeSelectPassword = () =>
  createSelector(
    selectGlobal,
    global => global.get('password'),
  );

const makeLoginError = () =>
  createSelector(
    selectGlobal,
    global => global.get('loginError'),
  );

export { makeSelectUsername, makeSelectPassword, makeLoginError };
