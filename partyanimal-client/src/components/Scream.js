import React, { Component } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // plugin of dayjs

// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

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
  render() {
    dayjs.extend(relativeTime); // extends dayjs
    const {
      classes,
      scream: {
        body,
        commentCount,
        createdAt,
        likeCount,
        screamId,
        userHandle,
        userImage
      }
    } = this.props;
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
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Scream);
