import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import theme from "../utilities/theme";

// Redux
import { connect } from "react-redux";
import { uploadProfileImg, logoutUser } from "../redux/actions/userActions";

// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import MUILink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import CalendarToday from "@material-ui/icons/CalendarToday";
import IconLink from "@material-ui/icons/Link";
import IconEdit from "@material-ui/icons/Edit";

const styles = theme => {
  return {
    paper: {
      padding: 20
    },
    profile: {
      "& .image-wrapper": {
        textAlign: "center",
        position: "relative",
        "& button": {
          position: "absolute",
          top: "80%",
          left: "70%"
        }
      },
      "& .profile-image": {
        width: 200,
        height: 200,
        objectFit: "cover",
        maxWidth: "100%",
        borderRadius: "50%"
      },
      "& .profile-details": {
        textAlign: "center",
        "& span, svg": {
          verticalAlign: "middle"
        },
        "& a": {
          color: theme.palette.primary.main
        }
      },
      "& hr": {
        border: "none",
        margin: "0 0 10px 0"
      },
      "& svg.button": {
        "&:hover": {
          cursor: "pointer"
        }
      }
    },
    buttons: {
      textAlign: "center",
      "& a": {
        margin: "20px 10px"
      }
    }
  };
};

class Profile extends Component {
  handleChange = event => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("Image", image, image.name);
    this.props.uploadProfileImg(formData);
  };

  handleEditPicture = () => {
    const fileInput = document.getElementById("profileImg");
    fileInput.click(); // opens file selection window
  };

  render() {
    const {
      classes,
      user: {
        credentials: {
          handle,
          createdAt,
          imageUrl, //
          bio,
          website,
          location
        },
        loading,
        authenticated
      }
    } = this.props;
    return loading ? (
      <p>Loading...</p>
    ) : authenticated ? (
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="image-wrapper">
            <img className="profile-image" src={imageUrl} alt="Profile" />
            <input
              type="file"
              id="profileImg"
              hidden="hidden"
              onChange={this.handleChange}
            />
            <Tooltip title="Change Profile Pic" placement="top">
              <IconButton className="button" onClick={this.handleEditPicture}>
                <IconEdit color="primary" />
              </IconButton>
            </Tooltip>
            <hr />
          </div>
          <div className="profile-details">
            <MUILink variant="h5" component={Link} to={`/users/${handle}`}>
              @{handle}
            </MUILink>
            {/* MUILink is build on top of Typography - can use variant */}
            <hr />
            {bio && <Typography variant="body2">{bio}</Typography>}
            <hr />
            {location && ( // Fragment use just to wrap things so that it will be 1 element
              <Fragment>
                <LocationOn color="primary" />
                <span>{location}</span>
                <hr />
              </Fragment>
            )}{" "}
            {/*span is for inline-elements*/}
            {website && (
              <Fragment>
                <IconLink color="primary" />
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {/* target ensures that that linked page will open in another tab
                            rel is needed for react*/}{" "}
                  {website}
                </a>
                <hr />
              </Fragment>
            )}
            <CalendarToday color="primary" />
            <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
          </div>
        </div>
      </Paper>
    ) : (
      <Paper className={classes.paper}>
        <Typography variant="body2" align="center">
          No Profile Found, Please Login Again
        </Typography>
        <div className={classes.buttons}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/login"
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/signup"
          >
            Signup
          </Button>
        </div>
      </Paper>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  uploadProfileImg: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = {
  uploadProfileImg,
  logoutUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Profile));
