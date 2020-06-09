import React, { Component } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // plugin of dayjs
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { likeScream, unlikeScream } from "../redux/actions/dataActions";

// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

// Icon
import IconChat from "@material-ui/icons/Chat";
import IconFavorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

const styles = {
  card: {
    display: "flex",
    marginBottom: 20
  },
  content: {
    padding: 25,
    objectFit: "cover" // so that image won't get stretched
  },
  image: {
    minWidth: 200
  }
};

class Scream extends Component {
  checkLiked = () => {
    if (
      this.props.user.likes.find(
        like => like.screamId === this.props.scream.screamId
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  likeScream = () => {
    this.props.likeScream(this.props.scream.screamId);
  };

  unlikeScream = () => {
    this.props.unlikeScream(this.props.scream.screamId);
  };

  render() {
    dayjs.extend(relativeTime); // extends dayjs
    const {
      classes,
      scream: {
        body,
        commentCount,
        createdAt,
        likeCount,
        userHandle,
        userImage
      },
      user: { authenticated }
    } = this.props;

    const likeButton = !authenticated ? (
      <Tooltip title="Like" placement="top">
        <IconButton className={classes.button}>
          <Link to="/login">
            <FavoriteBorder color="primary" />
          </Link>
        </IconButton>
      </Tooltip>
    ) : this.checkLiked() ? (
      <Tooltip title="Unlike" placement="top">
        <IconButton className={classes.button} onClick={this.unlikeScream}>
          <IconFavorite color="primary" />
        </IconButton>
      </Tooltip>
    ) : (
      <Tooltip title="Like" placement="top">
        <IconButton className={classes.button} onClick={this.likeScream}>
          <FavoriteBorder color="primary" />
        </IconButton>
      </Tooltip>
    );

    return (
      // use typography whenever you have display text preferred
      <Card className={classes.card}>
        <CardMedia
          className={classes.image}
          image={userImage}
          title="Profile Image"
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            color="primary"
            component={Link}
            to={`/users/${userHandle}`}
          >
            {userHandle}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{body}</Typography>
          {likeButton}
          <span>{likeCount} Likes</span>
          <Tooltip title="Comments" placement="top">
            <IconButton className={classes.button}>
              <IconChat color="primary" />
            </IconButton>
          </Tooltip>
          <span>{commentCount} Comments</span>
        </CardContent>
      </Card>
    );
  }
}

Scream.propTypes = {
  user: PropTypes.object.isRequired,
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = {
  likeScream,
  unlikeScream
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Scream));
