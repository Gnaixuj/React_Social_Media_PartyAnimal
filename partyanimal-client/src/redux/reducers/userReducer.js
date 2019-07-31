import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER
} from "../types";

const initialState = {
  // not the global state
  authenticated: false,
  credentials: {},
  likes: [],
  notifications: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED: // login
      return {
        ...state,
        authenticated: true
      };
    case SET_UNAUTHENTICATED: // used when we log out
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}