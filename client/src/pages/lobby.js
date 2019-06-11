import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { queryApi } from "../services";
import icon from "../MessageApp-icon.svg";
import logo from "../MessageApp-logo.svg";
import lobbyStyles from "./Lobby.module.scss";

export default () => (
  <Route exact path="/lobby">
    <div className={lobbyStyles.layout}>
      <div className={lobbyStyles.header}>
        <img src={logo} alt="MessageApp's logo" />
        <img src={icon} alt="MessageApp's icon" />
      </div>
      <MessageFeed />
    </div>
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
    console.log(messages);
    messagesArray = messages.map(message => (
      <Message key={message._id} {...message} />
    ));
  }

  return (
    <div className={lobbyStyles.messageContainer}>
      {fetchedMessages ? (
        <>
          <h1>Loaded Messages successful</h1>
          <ul>{messagesArray}</ul>
        </>
      ) : (
        <h1>loading messages</h1>
      )}
    </div>
  );
}

const Message = ({ content, author, createdAt }) => {
  return (
    <li>
      <div>
        <p>{author.username}</p>
        <p>{createdAt}</p>
        <p>{content}</p>
      </div>
    </li>
  );
};

async function fetchMessages() {
  try {
    const result = await queryApi(`
      query {
        messages {
          _id,
          content,
          createdAt,
          author {
            username
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
