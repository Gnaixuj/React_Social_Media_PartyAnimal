import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";

// MUI
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

// Icons
import IconAdd from "@material-ui/icons/Add";
import IconHome from "@material-ui/icons/Home";
import Notifications from "@material-ui/icons/Notifications";

class Navbar extends Component {
  render() {
    const { authenticated } = this.props;
    return (
      <div>
        <AppBar>
          <Toolbar className="navbar">
            {authenticated ? (
              <Fragment>
                <Tooltip title="Post a Scream" placement="top">
                  <IconButton>
                    <IconAdd />
                  </IconButton>
                </Tooltip>
                <Link to="/">
                  <Tooltip title="Home" placement="top">
                    <IconButton>
                      <IconHome />
                    </IconButton>
                  </Tooltip>
                </Link>
                <Tooltip title="Notifications" placement="top">
                  <IconButton>
                    <Notifications />
                  </IconButton>
                </Tooltip>
              </Fragment>
            ) : (
              <Fragment>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/">
                  Home
                </Button>
                <Button color="inherit" component={Link} to="/signup">
                  Sign Up
                </Button>
              </Fragment>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(Navbar);
