import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const AuthRoute = props => {
  console.log(props); // TBR
  const { component: Component, authenticated, ...rest } = props;
  return (
    <Route
      {...rest}
      render={props => {
        return authenticated ? <Redirect to="/" /> : <Component {...props} />;
      }}
    />
  );
};

AuthRoute.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
  return {
    authenticated: state.user.authenticated
  };
};

export default connect(mapStateToProps)(AuthRoute);
