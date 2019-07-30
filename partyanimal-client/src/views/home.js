import React, { Component } from "react";
import axios from "axios";

// Components
import Scream from "../components/Scream";

// MUI
import Grid from "@material-ui/core/Grid";

class home extends Component {
  state = {
    screams: null
  };

  // Fetch Data from Server
  componentDidMount() {
    axios
      .get("/getscreams")
      .then(response => {
        this.setState({
          screams: response.data
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    let recentScreams = this.state.screams ? (
      this.state.screams.map(scream => (
        <Scream key={scream.screamId} scream={scream} />
      ))
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          {recentScreams}
        </Grid>
        <Grid item xs={12} sm={4}>
          <p>Profile...</p>
        </Grid>
      </Grid>
    );
  }
}

export default home;
