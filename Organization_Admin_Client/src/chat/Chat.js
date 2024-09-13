
import React, { useState, useEffect } from "react";
import AC from "agora-chat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./Chat.css";
import image1 from "../assets/profile2.jpg";

function Chat() {
  const [conn, setConn] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // User A credentials (local host side)
  const userA = {
    id: "rajesh1234",
    token: "007eJxTYDj1yMJ5Oettc8/VEdbWZ3e9y8/RYz2yIiN7i/i11DVMa5gVGEwTzczNU8wMktJSDUwMDVMsTSyTjFPMk5LTzJKTjU1NHBi2pzUEMjJcMGBiYWRgZWAEQhBfhSExLdHUzMjMQNfULCVZ19AwNU3XItEsSTfJMNXM3DItKckgzRgA+v4mNA==",
  };
  
  // User B credentials (other host side)
  const userB = {
    id: "sala1234",
    token: "007eJxTYDBYrVzZv3mtjfTqnbxXl1y93xqcImKhLiHQOrtBK6as1EKBwTTRzNw8xcwgKS3VwMTQMMXSxDLJOMU8KTnNLDnZ2NQkm2F7WkMgI0OrviEDIwMrEDMygPgqDEkWBiZpBmYGuqZmKcm6hoapabqW5oYpuhbGqRaWZqnJFklJZgBjiyRw",
  };

  const recipient = {
    name: "Recipient Name",
    avatar: image1,
    role: "Recipient Role",
  };

  useEffect(() => {
    const appKey = "611182499#1369575";

    const connection = new AC.connection({ appKey });

    const options = {
      user: userA.id, // Assume you're User A on your localhost
      agoraToken: userA.token,
    };

    console.log("Attempting to login with options:", options);
    connection
      .open(options)
      .then(() => {
        console.log("Login to chat server success");
        setIsConnected(true);
      })
      .catch((error) => {
        console.error("Login to chat server failed", error);
      });

    connection.listen({
      onTextMessage: (message) => {
        console.log("Received message:", message);
        setMessages((prevMessages) => [
          ...prevMessages,
          { data: message.data, type: "incoming" },
        ]);
      },
    });

    setConn(connection);

    return () => {
      if (conn) {
        conn.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (isConnected && message.trim()) {
      console.log("Sending message:", message);
      let option = {
        chatType: "singleChat",
        type: "txt",
        to: userB.id, // Sending to User B
        msg: message,
      };

      let msg = AC.message.create(option);

      conn
        .send(msg)
        .then(() => {
          console.log("Send private text Success");
          setMessages((prevMessages) => [
            ...prevMessages,
            { data: message, type: "outgoing" },
          ]);
          setMessage("");
        })
        .catch((e) => {
          console.error("Send private text error", e);
        });
    } else {
      if (!isConnected) {
        console.error("Not connected to chat server");
      } else {
        console.error("Message is empty");
      }
    }
  };

  return (
    <div className="chat-containers">
      <div className="chat-header">
        <img src={recipient.avatar} alt="Avatar" className="avatar" />
        <div className="recipient-info">
          <h2>{recipient.name}</h2>
          <p>{recipient.role}</p>
        </div>
      </div>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.data}
          </div>
        ))}
      </div>
      <div className="input-container">
        <div className="icon-container paperclip">
          <button icon={faPaperclip} className="icon" />
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <FontAwesomeIcon icon={faPaperPlane} className="icon send-icon" onClick={sendMessage} />
      </div>
    </div>
  );
}

export default Chat;

