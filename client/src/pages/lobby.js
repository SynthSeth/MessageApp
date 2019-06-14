import React, { useState } from "react";
import Moment from "react-moment";
import { Route } from "react-router-dom";
import { queryApi } from "../services";
import logo from "../MessageApp-logo.svg";
import lobbyStyles from "./Lobby.module.scss";
import io from "socket.io-client";
const socket = io("http://192.168.0.2:8080");

export default () => {
  return (
    <Route exact path={["/lobby", "/"]}>
      <div className={lobbyStyles.header}>
        <img src={logo} alt="MessageApp's logo" />
      </div>
      <MessageFeed />
      <MessageForm />
    </Route>
  );
};

class MessageFeed extends React.Component {
  constructor(props) {
    super(props);

    this.state = { messages: [] };

    socket.on("NEW_MESSAGE", newMessage => {
      this.setState({
        messages: this.state.messages.slice().concat(newMessage)
      });

      const msgList = document.getElementById("msgList");
      msgList.scrollTop = msgList.scrollHeight + msgList.clientHeight;
    });
  }

  async componentDidMount() {
    if (!this.state.messages.length) {
      const loadedMessages = await fetchMessages();

      if (loadedMessages) {
        this.setState({
          messages: this.state.messages.slice().concat(loadedMessages)
        });

        const msgList = document.getElementById("msgList");
        if (msgList) {
          msgList.scrollTop = msgList.scrollHeight + msgList.clientHeight;
        }
      }
    }
  }

  render() {
    const messagesArray = this.state.messages.map(message => (
      <Message key={message._id} {...message} />
    ));

    return (
      <ul className={lobbyStyles.messageFeed} id="msgList">
        {messagesArray.length ? (
          messagesArray
        ) : (
          <div className={lobbyStyles.loading}>
            <div className="mesh-loader">
              <div className="set-one">
                <div className="circle" />
                <div className="circle" />
              </div>
              <div className="set-two">
                <div className="circle" />
                <div className="circle" />
              </div>
            </div>
          </div>
        )}
      </ul>
    );
  }
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
            onError={e => {
              e.target.onerror = null;
              e.target.src =
                "https://cdn.pixabay.com/photo/2014/04/03/10/32/businessman-310819_1280.png";
            }}
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
              {+createdAt || createdAt}
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

    // If request is unauthenticated, then token is invalid/expired --> redirect to login
    if (result.errors[0].message === "Unauthenticated request") {
      localStorage.clear();
      window.location.href = "/auth/login";
    }

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
          if (e.keyCode === 13 && !e.shiftKey) {
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

    return result.data;
  } catch (err) {
    console.log("There was a problem loading messages"); // refetch messages again # if times
    return false;
  }
}
