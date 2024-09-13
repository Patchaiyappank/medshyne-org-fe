import { useState } from "react";
import { client } from "./settings";
import { Grid, Button } from "@material-ui/core";
import MicNoneIcon from "@material-ui/icons/MicNone";
import MicOffOutlinedIcon from "@material-ui/icons/MicOffOutlined";
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import VideocamOffOutlinedIcon from "@material-ui/icons/VideocamOffOutlined";
import CallEndOutlinedIcon from "@material-ui/icons/CallEndOutlined";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
// import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  micButton: {
    backgroundColor: "#FFFFFF",
    color: "black",
    borderRadius: "50%",
    height: "35px",
    width: "35px",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "auto",
    boxSizing: "content-box",
    "&:hover": {
      backgroundColor: "white",
      opacity: 1,
    },
  },
  callEndButton: {
    backgroundColor: "#F43E3D",
    color: "white",
    borderRadius: "50%",
    height: "35px",
    width: "35px",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "auto",
    boxSizing: "content-box",
    "&:hover": {
      backgroundColor: "#F43E3D",
    },
    chatContainer: {
      position: "fixed",
      right: 0,
      top: 0,
      height: "100%",
      width: "300px",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderLeft: "1px solid #ccc",
      borderRadius: "8px 0 0 8px",
      display: "flex",
      flexDirection: "column",
      padding: "10px",
      zIndex: 1000,
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      overflowY: "auto",
    },
  },
});

export default function Controls(props) {
  // const client = clients();
  const { tracks, setStart, setInCall,setShowChat,showChat } = props;
  const [trackState, setTrackState] = useState({ video: true, audio: true });
  const classes = useStyles();

  const toggleChat = () => {
    setShowChat((prevShowChat) => !prevShowChat);
  };

  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
  };

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      style={{
        position:"fixed",
        left: showChat ? "40%":"50%",
        height: "65px",
        transform: "translateX(-50%)",
        bottom: "40px",
        backdropFilter: "blur(10px)",
        backgroundColor: "#FFFFFF",
        borderRadius: "40px",
        padding: "18px 35px 18px 35px",
        zIndex: "1000",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "418px",
        alignContent: "center",
        overflow:"hidden",
        boxShadow: "0 4px 2px -2px rgba(0, 0, 0, 0.2)"
      }}
    >
      <Grid item>
        <Button
          className={classes.micButton}
          variant="contained"
          color={trackState.audio ? "primary" : "secondary"}
          onClick={() => mute("audio")}
        >
          {trackState.audio ? (
            <MicNoneIcon style={{ fontSize: "23px" }} />
          ) : (
            <MicOffOutlinedIcon style={{ fontSize: "23px" }} />
          )}
        </Button>
      </Grid>
      <Grid item>
        <Button
          className={classes.micButton}
          variant="contained"
          color={trackState.video ? "primary" : "secondary"}
          onClick={() => mute("video")}
        >
          {trackState.video ? (
            <VideocamOutlinedIcon />
          ) : (
            <VideocamOffOutlinedIcon />
          )}
        </Button>
      </Grid>
      <Grid item>
        <Button
          className={classes.callEndButton}
          variant="contained"
          color="default"
          onClick={() => leaveChannel()}
        >
          <CallEndOutlinedIcon />
        </Button>
      </Grid>
      <Grid item>
        <Button className={classes.micButton} onClick={toggleChat}>
          <ChatBubbleOutlineIcon style={{ fontSize: "17px" }} />
        </Button>
      </Grid>
      <Grid>
        <Button className={classes.micButton}>
          <FullscreenIcon />
          {/* <FullscreenExitIcon/> */}
        </Button>
      </Grid>
    </Grid>
  );
}
