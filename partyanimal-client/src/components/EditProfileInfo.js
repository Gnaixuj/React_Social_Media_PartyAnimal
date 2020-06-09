import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { editUserDetails } from "../redux/actions/userActions";

// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

// Icons
import IconEdit from "@material-ui/icons/Edit";

const styles = theme => {
  return {
    palette: {
      primary: {
        light: "#33c9dc",
        main: "#00bcd4",
        dark: "#008394",
        contrastText: "#fff" // text color white
      },
      secondary: {
        light: "#ff6333",
        main: "#ff3d00",
        dark: "#b22a00",
        contrastText: "#fff"
      }
    },
    typography: {
      useNextVariants: true
    },
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
      position: "relative", // so that progress can be in the middle
      float: "right"
    },
    error: {
      color: "red",
      fontSize: "0.8rem"
    },
    progress: {
      position: "absolute"
    }
  };
};

class EditProfileInfo extends Component {
  state = {
    bio: "",
    location: "",
    website: "",
    open: false
  };

  mapDetailsToState = credentials => {
    const { bio, location, website } = credentials;
    this.setState({
      bio: bio ? bio : "",
      location: location ? location : "",
      website: website ? website : ""
    });
  };

  componentDidMount() {
    this.mapDetailsToState(this.props.credentials);
  }

  handleOpen = () => {
    this.setState({ open: true });
    this.mapDetailsToState(this.props.credentials);
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = () => {
    const userDetails = {
      bio: this.state.bio,
      location: this.state.location,
      website: this.state.website
    };
    this.props.editUserDetails(userDetails);
    this.handleClose();
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Tooltip title="Edit Info" placement="top">
          <IconButton className={classes.button} onClick={this.handleOpen}>
            <IconEdit color="primary" />
          </IconButton>
        </Tooltip>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit Your Profile Details</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                className={classes.textField}
                type="text"
                name="bio"
                label="Bio"
                multiline
                placeholder="Something About Yourself"
                value={this.state.bio}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField />
              <TextField
                className={classes.textField}
                type="text"
                name="location"
                label="Location"
                placeholder="Where You Live"
                value={this.state.location}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField />
              <TextField
                className={classes.textField}
                type="text"
                name="website"
                label="Website"
                placeholder="Your Personal/Professional Website"
                value={this.state.website}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

EditProfileInfo.propTypes = {
  editUserDetails: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  credentials: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    credentials: state.user.credentials
  };
};

const mapDispatchToProps = {
  editUserDetails
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(EditProfileInfo));
