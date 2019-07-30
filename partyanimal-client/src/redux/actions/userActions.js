import axios from "axios";
import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI } from "../types";

export const loginUser = (userData, history) => dispatch => { // history pass into
  dispatch({ type: LOADING_UI });

  axios
    .post("/login", userData)
    .then(response => {
      // if we reach here, we have the token on response.data.token
      const FBToken = response.data.idToken;
      localStorage.setItem("FBIdToken", `Bearer ${FBToken}`); // token in local storage
      // each request that we need to send to a protected route, we also need to add a authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${FBToken}`;
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/"); // helps to redirect page to Home
    })
    .catch(err => {
      dispatch({
          type: SET_ERRORS,
          payload: err.response.data
      })
    });
};

export const getUserData = () => dispatch => {
    axios.get('/user')
        .then(response => {
            dispatch({ // action
                type: SET_USER,
                payload: response.data // payload is the data we send to the reducers in which the reducer will do sth with it
            })
        })
        .catch(err => console.log(err));
};
