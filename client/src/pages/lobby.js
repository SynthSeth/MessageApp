import React, { useState, useEffect } from "react";
import Moment from "react-moment";
import { Route } from "react-router-dom";
import { queryApi } from "../services";
import logo from "../MessageApp-logo.svg";
import lobbyStyles from "./Lobby.module.scss";

export default () => (
  <Route exact path="/lobby">
    <>
      <div className={lobbyStyles.header}>
        <img src={logo} alt="MessageApp's logo" />
      </div>
      <MessageFeed />
      <MessageForm />
    </>
  </Route>
);

function MessageFeed() {
  const [fetchedMessages, setFetchedMessages] = useState(false);
  const [messages, setMessages] = useState([]);

  let messagesArray = null;

  if (!fetchedMessages) {
    (async function() {
      const loadedMessages = await fetchMessages();

      if (loadedMessages) {
        setFetchedMessages(true);
        setMessages(messages.concat(loadedMessages));
      }
    })();
  } else {
    messagesArray = messages.map(message => (
      <Message key={message._id} {...message} />
    ));
  }

  useEffect(() => {
    const msgList = document.getElementById("msgList");
    msgList.scrollTop = msgList.scrollHeight + msgList.clientHeight;
  });

  return (
    <ul className={lobbyStyles.messageFeed} id="msgList">
      {fetchedMessages ? messagesArray : <h1>loading messages</h1>}
    </ul>
  );
}

const Message = ({ content, author, createdAt }) => {
  return (
    <li>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "0 0.5rem"
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <img
            src={author.profileImageUrl}
            alt={"profile image of " + author.username}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "0.5rem",
              justifyContent: "flex-start"
            }}
          >
            <p
              style={{
                color: "#2A81D8",
                fontSize: "18px",
                fontWeight: 400,
                letterSpacing: "2px",
                position: "relative",
                bottom: "10px"
              }}
            >
              {author.username}
            </p>
            <Moment fromNow style={{ position: "relative", bottom: "25px" }}>
              {+createdAt}
            </Moment>
          </div>
        </div>
        <p
          style={{
            fontWeight: 200,
            fontSize: "18px",
            position: "relative",
            bottom: "25px",
            letterSpacing: "1.25px"
          }}
        >
          {content}
        </p>
      </div>
    </li>
  );
};

async function fetchMessages() {
  try {
    const result = await queryApi(`
      query {
        messages(sortByCreatedAt: "asc") {
          _id,
          content,
          createdAt,
          author {
            username,
            profileImageUrl
          }
        }
      }
    `);

    const messages = result.data.messages;
    return messages;
  } catch (err) {
    console.log("There was a problem loading messages"); // refetch messages again # if times
    return false;
  }
}

const MessageForm = () => {
  const [content, setContent] = useState("");
  const handleChange = e => setContent(e.target.value);

  const handleSubmit = e => {
    e.preventDefault();

    createMessage(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className={lobbyStyles.messageForm}>
      <textarea
        placeholder="Enter a message"
        onChange={handleChange}
        value={content}
        onKeyDown={e => {
          if (e.keyCode == 13 && !e.shiftKey) {
            // prevent default behavior
            e.preventDefault();
            // submit form
            handleSubmit(e);
          }
        }}
      />
    </form>
  );
};

async function createMessage(content) {
  try {
    const result = await queryApi(`
      mutation {
        createMessage(content: "${content}") {
          content,
          createdAt,
          author {
            username,
            profileImageUrl
          }
        }
      }
    `);

    console.log(result.data);
    return result.data;
  } catch (err) {
    console.log("There was a problem loading messages"); // refetch messages again # if times
    return false;
  }
}
