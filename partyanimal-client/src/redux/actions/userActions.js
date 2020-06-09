import axios from "axios";
import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  LOADING_USER,
  SET_UNAUTHENTICATED
} from "../types";

// Helper Function
const setAuthorizationHeader = token => {
  localStorage.setItem("FBIdToken", `Bearer ${token}`); // token in local storage
  // each request that we need to send to a protected route, we also need to add a authorization header
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const loginUser = (userData, history) => dispatch => {
  // history pass into
  dispatch({ type: LOADING_UI });

  axios
    .post("/login", userData)
    .then(response => {
      // if we reach here, we have the token on response.data.token
      const FBToken = response.data.idToken;
      setAuthorizationHeader(FBToken);
      dispatch(getUserDetails());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/"); // helps to redirect page to Home
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

export const signupUser = (newUserData, history) => dispatch => {
  // history pass into
  dispatch({ type: LOADING_UI });

  axios
    .post("/signup", newUserData)
    .then(response => {
      // if we reach here, we have the token on response.data.token
      const FBToken = response.data.idToken;
      setAuthorizationHeader(FBToken);
      dispatch(getUserDetails());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/"); // helps to redirect page to Home
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

export const logoutUser = () => dispatch => {
  localStorage.removeItem("FBIdToken"); // remove token from local storage
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const getUserDetails = () => dispatch => {
  dispatch({ type: LOADING_USER });
  axios
    .get("/user")
    .then(response => {
      dispatch({
        // action
        type: SET_USER,
        payload: response.data // payload is the data we send to the reducers in which the reducer will do sth with it
      });
    })
    .catch(err => console.log(err));
};

export const uploadProfileImg = formData => dispatch => {
  dispatch({ type: LOADING_USER });
  axios
    .post("/user/image", formData)
    .then(() => {
      dispatch(getUserDetails());
    })
    .catch(err => console.log(err));
};

export const editUserDetails = userDetails => dispatch => {
  dispatch({ type: LOADING_USER });
  axios
    .post("/user", userDetails)
    .then(() => {
      dispatch(getUserDetails());
    })
    .catch(err => console.log(err));
};
