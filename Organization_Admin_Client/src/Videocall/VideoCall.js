import { useState, useEffect } from "react";
import { config, client, channelName } from "./settings.js";
import { Grid } from "@material-ui/core";
import Video from "./Video.js";
import Controls from "./Controls";
import AgoraRTC from "agora-rtc-sdk-ng";

export default function VideoCall(props) {
  const { setInCall, setShowChat, showChat } = props;
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const createLocalTracks = async () => {
      try {
        const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        setTracks([microphoneTrack, cameraTrack]);
        setReady(true);
      } catch (error) {
        console.error("Error creating local tracks:", error);
      }
    };

    createLocalTracks();

    const init = async (name) => {
      client.on("user-published", async (user, mediaType) => {
        if (users.length < 1) {
          await client.subscribe(user, mediaType);
          if (mediaType === "video") {
            setUsers((prevUsers) => [...prevUsers, user]);
          }
          if (mediaType === "audio") {
            user.audioTrack.play();
          }
        } else {
          await client.unsubscribe(user, mediaType);
          await client.kick(user);
        }
      });

      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "audio" && user.audioTrack) {
          user.audioTrack.stop();
        }
        if (mediaType === "video") {
          setUsers((prevUsers) =>
            prevUsers.filter((User) => User.uid !== user.uid)
          );
        }
      });

      client.on("user-left", (user) => {
        setUsers((prevUsers) =>
          prevUsers.filter((User) => User.uid !== user.uid)
        );
      });

      try {
        await client.join(config.appId, name, config.token, null);
        if (ready && tracks.length > 0) {
          await client.publish([tracks[0], tracks[1]]);
          setStart(true);
        }
      } catch (error) {
        console.error("Error joining or publishing", error);
      }
    };

    if (ready && tracks.length > 0) {
      init(channelName);
    }
  }, [client, ready, tracks, users.length]);

  return (
    <div style={{ display: "flex", height: "100vh", gap: "10px", overflow: "hidden" }}>
      <div
        style={{
          flex: showChat ? "0 0 100%" : "1",
          backgroundColor: "#f0f0f0",
          position: "relative",
          transition: "flex 0.3s ease",
        }}
      >
        <Grid container direction="column" style={{ height: "100%" }}>
          <Grid item>
            {ready && tracks.length > 0 && (
              <Controls
                tracks={tracks}
                setStart={setStart}
                setInCall={setInCall}
                setShowChat={setShowChat}
                showChat={showChat}
              />
            )}
          </Grid>
          <Grid item style={{ height: "100%", overflow: "hidden" }}>
            {start && tracks.length > 0 && (
              <Video tracks={tracks} users={users} showChat={showChat} />
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
