// import "./Video.css"
import { AgoraVideoPlayer,LocalVideoTrack, RemoteVideoTrack } from "agora-rtc-react";
import { CircularProgress, Typography } from "@material-ui/core";
import { useState, useEffect } from "react";
require("dotenv").config();

export default function Video(props) {
  const { users, tracks,showChat } = props;
  const [mainVideo, setMainVideo] = useState(null);
  const [subVideo, setSubVideo] = useState(null);
  const [isDoctorJoined, setIsDoctorJoined] = useState(false);

  useEffect(() => {
    if (tracks && tracks[1]) {
      setMainVideo(tracks[1]);
    }
  }, [tracks]);

  useEffect(() => {
    if (users.length > 0 && users[0].videoTrack) {
      setSubVideo(users[0].videoTrack);
      setIsDoctorJoined(true);
    }
  }, [users]);

  ////
  const renderVideoTrack = (videoTrack, style) => {
    if (!videoTrack) return null;

    const VideoComponent = videoTrack instanceof LocalVideoTrack ? LocalVideoTrack : RemoteVideoTrack;

    return (
      <VideoComponent
        track={videoTrack}
        style={{
          ...style,
          objectFit: "cover",
          transform: "rotateY(180deg)", // Ensure proper orientation
        }}
      />
    );
  };



  return (
    <div
    style={{
      height: "100%",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    }}
  >
    {!isDoctorJoined ? (
      <div
      style={{
        backgroundColor: "white",
        height: "500px",
        width: "1400px",
        marginTop: "-70px",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      >
        
          <div style={{ width: "90%", display: "flex" }}>
            <div
              style={{
                height: "400px",
                width: "830px",
                borderRadius: "20px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              
              }}
            >
              {renderVideoTrack(mainVideo, {
                height: "100%",
                width: "100%",
                borderRadius: "20px",
              })}
            </div>
            <div
              style={{
                width: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" style={{ marginBottom: 20 }}>
                  Please Wait for the Doctor to attend the call
                </Typography>
                <CircularProgress size={60} />
              </div>
            </div>
          </div>
       
      </div>
    ) : (
      <div
        style={{
          height: "100vh",
          width: showChat ?"65vw":"100vw",
          display: "flex",
          alignItems: "center",
          justifyContent:"center",
          position: "absolute", // Ensures it's on top of other elements
          top: showChat?-50:0,
          left: showChat? 50:0,
          overflow:"hidden",// Ensure video is clipped to the container's border radius
          borderRadius: showChat ? "20px" : "0px",
        }}
      >
       {renderVideoTrack(mainVideo, {
            height: showChat ? "calc(100% - 25%)" : "100%",
            width: showChat ? "calc(100% - 0%)" : "100%",
            transition: "height 0.3s ease, width 0.3s ease",
            borderRadius: showChat ? "20px" : "0px",
          })}
        {subVideo && (
          <div
            style={{
              position: "absolute",
                bottom:showChat ? "15%": "15%",
                right: showChat ? "5%" : "8%",
                width: showChat ? "25%" : "20%",
                height: showChat ? "20%" : "20%",
                cursor: "pointer",
                borderRadius: "10px",
                overflow: "hidden",
                transition: "width 0.3s ease, height 0.3s ease",
            }}
            onClick={() => {
              const temp = mainVideo;
              setMainVideo(subVideo);
              setSubVideo(temp);
            }}
          >
            {renderVideoTrack(subVideo, {
                height: "100%",
                width: "100%",
                borderRadius: "10px",
              })}
          </div>
        )}
      </div>
    )}
  </div>
  
  );
}
