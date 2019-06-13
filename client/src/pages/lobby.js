import React, { useState, useEffect } from "react";
import Moment from "react-moment";
import { Route } from "react-router-dom";
import { queryApi } from "../services";
import icon from "../MessageApp-icon.svg";
import logo from "../MessageApp-logo.svg";
import lobbyStyles from "./Lobby.module.scss";

export default () => (
  <Route exact path="/lobby">
    <>
      <div className={lobbyStyles.header}>
        <img src={logo} alt="MessageApp's logo" />
        <img src={icon} alt="MessageApp's icon" />
      </div>
      <MessageFeed />
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
        <img
          src={author.profileImageUrl}
          alt={"profile image of " + author.username}
        />
        <p>{author.username}</p>
        <Moment fromNow>{+createdAt}</Moment>
        <p>{content}</p>
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
