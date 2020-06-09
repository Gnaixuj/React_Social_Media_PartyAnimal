import {
  SET_SCREAMS,
  LOADING_DATA,
  LIKE_SCREAM,
  UNLIKE_SCREAM
} from "../types";

const initialState = {
  screams: [], // an array of all screams
  scream: {}, // to see 1 scream
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_SCREAMS:
      return {
        ...state,
        screams: action.payload,
        loading: false
      };
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      };
    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      let index = state.screams.findIndex(
        scream => scream.screamId === action.payload.screamId
      );
      state.screams[index] = action.payload; // as the database will return a new scream with likeCount incremented
      return {
        ...state
      };
    default:
      return state;
  }
}
