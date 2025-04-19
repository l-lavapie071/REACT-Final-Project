import React, { useEffect, useState } from "react";
import axios from "axios";
import { initTwilio } from "../api/twilioClient";

const ChatRoom = ({ username, room }) => {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");

  useEffect(() => {
    const init = async () => {
      const res = await axios.get(
        `https://testconvo-2533.twil.io/generateAccessToken?identity=${username}`
      );

      const client = await initTwilio(res.data.token);

      let convo = await client
        .getConversationByUniqueName(room)
        .catch(async () => {
          return await client.createConversation({ uniqueName: room });
        });

      convo.join().catch(() => {});
      setConversation(convo);

      convo.getMessages().then((msgs) => {
        setMessages(msgs.items);
      });

      convo.on("messageAdded", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    };

    init();
  }, [room, username]);

  const sendMessage = async () => {
    if (conversation && msgInput.trim()) {
      await conversation.sendMessage(msgInput);
      setMsgInput("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Stock Room: {room}</div>
      <div className="chat-body">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.author === username ? "you" : "other"}`}
          >
            <p>
              <strong>{msg.author}</strong>:{" "}
              {msg.body.match(/\.(jpg|jpeg|png|gif)$/) ? (
                <img
                  src={msg.body}
                  alt="shared"
                  style={{ maxWidth: "200px" }}
                />
              ) : msg.body.startsWith("http") ? (
                <a href={msg.body} target="_blank" rel="noreferrer">
                  {msg.body}
                </a>
              ) : (
                msg.body
              )}
            </p>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={msgInput}
          onChange={(e) => setMsgInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
