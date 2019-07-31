import React, { Component } from "react";
import PropTypes from "prop-types";
import AppLogo from "../images/app-logo.jpg";
import { Link } from "react-router-dom";

// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

// Redux
import { connect } from "react-redux";
import { signupUser } from "../redux/actions/userActions";

const styles = {
  form: {
    textAlign: "center"
  },
  image: {
    height: 225,
    width: 225
  },
  title: {
    margin: "0 auto 20px auto"
  },
  textField: {
    margin: "10px auto 10px auto"
  },
  button: {
    margin: "10px auto 10px auto",
    position: "relative" // so that progress can be in the middle
  },
  error: {
    color: "red",
    fontSize: "0.8rem"
  },
  progress: {
    position: "absolute"
  }
};

class signup extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      handle: "",
      // loading: false, // make a loading spinner
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps); // TBR
    if (nextProps.ui.errors) {
      this.setState({
        errors: nextProps.ui.errors
      });
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault(); // so as to not reload the page && showing the entered info in the url
    // this.setState({
    //   loading: true
    // });
    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      handle: this.state.handle
    };
    this.props.signupUser(newUserData, this.props.history);
    // axios
    //   .post("/signup", newUserData)
    //   .then(response => {
    //     console.log(response.data);
    //     localStorage.setItem('FBIdToken', `Bearer ${response.data.token}`); // to store the token  so that we still
    //     this.setState({                                                    // access to token if app refresh or browser closed
    //       loading: false
    //     });
    //     this.props.history.push("/"); // helps to redirect page to Home
    //   })
    //   .catch(err => {
    //     this.setState({
    //       errors: err.response.data,
    //       loading: false
    //     });
    //   });
  };

  render() {
    const {
      classes,
      ui: { loading }
    } = this.props;
    const { errors } = this.state;
    return (
      // sm take up the whole width
      <Grid container className={classes.form}>
        <Grid item sm={4} />
        <Grid item sm={4}>
          <img className={classes.image} src={AppLogo} alt="Party Animal" />
          <Typography className={classes.title} variant="h3">
            Signup
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            {/* noValidate - not validate the email field */}
            {errors.general && (
              <Typography className={classes.error} variant="body2">
                {errors.general}
              </Typography>
            )}
            <TextField
              className={classes.textField}
              id="email"
              name="email"
              type="email"
              label="Email"
              autoComplete="email"
              value={this.state.email}
              onChange={this.handleChange}
              helperText={errors.email} // error text underneath imput box
              error={errors.email ? true : false} // set helperText to red if there's error
              variant="outlined"
              fullWidth
            />
            <TextField
              className={classes.textField}
              id="password"
              name="password"
              type="password"
              label="Password"
              value={this.state.password}
              onChange={this.handleChange}
              helperText={errors.password}
              error={errors.password ? true : false}
              variant="outlined"
              fullWidth
            />
            <TextField
              className={classes.textField}
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              helperText={errors.confirmPassword} // error text underneath imput box
              error={errors.confirmPassword ? true : false} // set helperText to red if there's error
              variant="outlined"
              fullWidth
            />
            <TextField
              className={classes.textField}
              id="handle"
              name="handle"
              type="text"
              label="Handle"
              value={this.state.handle}
              onChange={this.handleChange}
              helperText={errors.handle} // error text underneath imput box
              error={errors.handle ? true : false} // set helperText to red if there's error
              variant="outlined"
              fullWidth
            />
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Signup
              {loading && (
                <CircularProgress className={classes.progress} size={30} />
              )}
            </Button>
            <br />
            <small>
              Already Have an Account? Login<Link to="/login"> Here</Link>
            </small>
          </form>
        </Grid>
        <Grid item sm={4} />
      </Grid>
    );
  }
}

signup.propTypes = {
  classes: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  // takes in global state
  return {
    // now the user & ui is brought in from the global state and map into our component props
    user: state.user,
    ui: state.ui
  };
};

const mapDispatchToProps = {
  signupUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(signup));
