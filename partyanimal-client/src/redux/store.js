import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk"; // a piece of middleware to store

// Reducers
import dataReducer from "./reducers/dataReducer";
import uiReducer from "./reducers/uiReducer";
import userReducer from "./reducers/userReducer";

const initialState = {};

const middleware = [thunk]; // depending on use case, can use other middleware OR create yr own

const reducers = combineReducers({ // global state
  data: dataReducer,
  ui: uiReducer,
  user: userReducer
});

const store = createStore(
  reducers,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // to use redux devtools
  )
);

export default store; 

// This File Contains Our Application State