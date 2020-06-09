import axios from "axios";
import {
  SET_SCREAMS,
  LOADING_DATA,
  LIKE_SCREAM,
  UNLIKE_SCREAM
} from "../types";

export const getScreams = () => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/getscreams")
    .then(response => {
      dispatch({
        type: SET_SCREAMS,
        payload: response.data
      });
    })
    .catch(err => {
      dispatch({
        type: SET_SCREAMS,
        payload: []
      });
      console.error(err);
    });
};

export const likeScream = screamId => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/scream/${screamId}/like`)
    .then(response => {
      dispatch({
        type: LIKE_SCREAM,
        payload: response.data // payload here is the like
      });
    })
    .catch(err => console.log(err));
};

export const unlikeScream = screamId => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/scream/${screamId}/unlike`)
    .then(response => {
      dispatch({
        type: UNLIKE_SCREAM,
        payload: response.data // payload here is the like
      });
    })
    .catch(err => console.log(err));
};
