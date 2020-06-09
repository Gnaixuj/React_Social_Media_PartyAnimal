import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { getScreams } from "../redux/actions/dataActions";

// Components
import Scream from "../components/Scream";
import Profile from "../components/Profile";

// MUI
import Grid from "@material-ui/core/Grid";

class home extends Component {
  // Fetch Data from Server
  componentDidMount() {
    this.props.getScreams();
  }

  render() {
    const { screams, loading } = this.props.data;
    let recentScreams = !loading ? (
      screams.map(scream => <Scream key={scream.screamId} scream={scream} />)
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          {recentScreams}
        </Grid>
        <Grid item xs={12} sm={4}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  data: PropTypes.object.isRequired,
  getScreams: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    data: state.data
  };
};

const mapDispatchToProps = {
  getScreams
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(home);
