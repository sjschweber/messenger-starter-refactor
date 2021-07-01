import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Avatar } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  },
  date: {
    fontSize: 11,
    color: "#BECCE2",
    fontWeight: "bold",
    marginBottom: 5
  },
  text: {
    fontSize: 14,
    color: "#91A3C0",
    letterSpacing: -0.2,
    padding: 8,
    fontWeight: "bold"
  },
  bubble: {
    background: "#F4F6FA",
    borderRadius: "10px 10px 0 10px"
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  }
}));

const SenderBubble = (props) => {
  const classes = useStyles();
  const { time, text, isRead, otherUser, isMostRecentRead } = props;
  return (
    <Box className={classes.root}>
      <Typography className={classes.date}>{time}</Typography>
      <Box className={classes.bubble}>
        <Typography className={classes.text}>{text}</Typography>
      </Box>
      {isMostRecentRead &&
        <Avatar alt={otherUser.username} className={classes.small} src={otherUser.photoUrl}></Avatar>
      }
    </Box>
  );
};

export default SenderBubble;
