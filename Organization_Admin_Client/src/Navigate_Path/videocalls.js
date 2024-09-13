import { useState,React} from "react";
import { Button } from "@material-ui/core";
import VideoCall from "../Videocall/VideoCall";
import Chat from "../chat/Chat";
import "./AppVideoChat.css";
import {AgoraRTCProvider} from "agora-rtc-react"
import { client } from "../Videocall/settings";

function App() {
  const [inCall, setInCall] = useState(false);
  const [showChat, setShowChat] = useState(false); 
  return (

    <AgoraRTCProvider value={client}>
    <div className="App" style={{ display: "flex" }}>
      {inCall && (
        <div className={`app-container ${showChat ? "show-chat" : ""}`} style={{ display: "flex", flex: 1 }}>
          <div className="video-container">
            <VideoCall setInCall={setInCall} setShowChat={setShowChat} showChat={showChat} />
          </div>
          {showChat && (
            <div className="chat-container">
              <Chat />
            </div>
          )}
        </div>
      )}
      {!inCall && (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setInCall(true)}
          >
            Join Call
          </Button>
        </div>
      )}
    </div>
    </AgoraRTCProvider>
  );

}



export default App;
