/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */
export const DEFAULT_LOCALE = 'en';
// export const API_URL = 'http://localhost:3001/api';
// export const STATIC_URL = 'http://localhost:3001/uploads/';

// export const API_URL = 'http://35.204.144.169:3001/api';
// export const STATIC_URL = 'http://35.204.144.169:3001/uploads/';

// export const CONTRACT_URL = 'http://34.70.46.65:8080/ipfs/';

// production config k8s
// export const SERVER_URL = '91d90ac373dc.sn.mynetname.net:2020';
export const SERVER_URL = 'http://91d90ac373dc.sn.mynetname.net:31080';
export const API_URL = 'http://91d90ac373dc.sn.mynetname.net:30301/api';
export const CONTRACT_URL = ' http://91d90ac373dc.sn.mynetname.net:30880/ipfs/';
export const STATIC_URL =
  'http://91d90ac373dc.sn.mynetname.net:30301/api/uploads/';
// export const API_URL = 'http://91d90ac373dc.sn.mynetname.net:2020/api';
// export const STATIC_URL = 'http://91d90ac373dc.sn.mynetname.net:2020/api/uploads/';
// export const CONTRACT_URL = 'http://91d90ac373dc.sn.mynetname.net:2020/ipfs/';

export const CURRENCY = 'XOF';
export const CHANGE_USERNAME = 'CHANGE_USERNAME';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const SET_AUTH = 'SET_AUTH';
export const SENDING_REQUEST = 'SENDING_REQUEST';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const LOGOUT = 'LOGOUT';
export const REQUEST_ERROR = 'REQUEST_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';
