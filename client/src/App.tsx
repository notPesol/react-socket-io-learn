import { useEffect, useState } from "react";
import "./App.css";

import io from "socket.io-client";

type Message = {
  name: string;
  message: string;
};

const socket = io("http://127.0.0.1:5000/");

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [value, setValue] = useState("");

  const isJoinedSuccess = joined && isConnected;

  const join = () => {
    if (isConnected && !joined) {
      socket.emit("join", name);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (isJoinedSuccess) {
      socket.emit("message", { name, message: value.trim() });
      setValue("");
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("message", ({ name, message }: Message) => {
      setMessages((prev) => [...prev, { name, message }]);
    });

    socket.on("joined", (jName) => {
      console.log(jName + " is join...");
      setMessages((prevState) => {
        return [...prevState, { name: jName, message: "Has join the room" }];
      });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  }, []);

  return (
    <div className="App">
      <div className="name-form">
        <input
          disabled={isJoinedSuccess}
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button disabled={isJoinedSuccess} onClick={join}>
          Join
        </button>
      </div>
      <div className="container py-5">
        <div className="row d-flex justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-4">
            <div className="card" id="chat1" style={{ borderRadius: "15px" }}>
              <div
                className="card-header d-flex justify-content-between align-items-center p-3 bg-info text-white border-bottom-0"
                style={{
                  borderTopLeftRadius: "15px",
                  borderTopRightRadius: "15px",
                }}
              >
                <i className="fas fa-angle-left"></i>
                <p className="mb-0 fw-bold">Live chat</p>
                <i className="fas fa-times"></i>
              </div>
              <div className="card-body">
                <div className="d-flex flex-row justify-content-start mb-4 align-items-center">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                    alt="avatar 1"
                    style={{ width: "45px", height: "100%" }}
                  />
                  <div
                    className="p-3 ms-3"
                    style={{
                      borderRadius: "15px",
                      backgroundColor: "rgba(57, 192, 237,.2)",
                    }}
                  >
                    <p className="small mb-0">
                      Hello and thank you htmlFor visiting MDBootstrap. Please
                      click the video below.
                    </p>
                  </div>
                </div>

                <div className="d-flex flex-row justify-content-end mb-4 align-items-center">
                  <div
                    className="p-3 me-3 border"
                    style={{
                      borderRadius: "15px",
                      backgroundColor: "#fbfbfb",
                    }}
                  >
                    <p className="small mb-0">
                      Thank you, I really like your product.
                    </p>
                  </div>
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                    alt="avatar 1"
                    style={{ width: "45px", height: "100%" }}
                  />
                </div>

                <div className="d-flex flex-row justify-content-start mb-4 align-items-center">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                    alt="avatar 1"
                    style={{ width: "45px", height: "100%" }}
                  />
                  <div
                    className="p-3 ms-3"
                    style={{
                      borderRadius: "15px",
                      backgroundColor: "rgba(57, 192, 237,.2)",
                    }}
                  >
                    <p className="small mb-0">...</p>
                  </div>
                </div>

                {messages.map((message, i) => {
                  if (name === message.name) {
                    return (
                      <div
                        key={i}
                        className="d-flex flex-row justify-content-end mb-4 align-items-center"
                      >
                        <div
                          className="p-3 me-3 border"
                          style={{
                            borderRadius: "15px",
                            backgroundColor: "#fbfbfb",
                          }}
                        >
                          <p className="small mb-0">{message.message}</p>
                        </div>
                        <p>You</p>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={i}
                        className="d-flex flex-row justify-content-start mb-4 align-items-center"
                      >
                        <p>{message.name}</p>
                        <div
                          className="p-3 ms-3"
                          style={{
                            borderRadius: "15px",
                            backgroundColor: "rgba(57, 192, 237,.2)",
                          }}
                        >
                          <p className="small mb-0">{message.message}</p>
                        </div>
                      </div>
                    );
                  }
                })}

                <div className="form-outline">
                  <textarea
                    className="form-control"
                    id="textAreaExample"
                    rows={4}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  ></textarea>
                  <label className="form-label" htmlFor="textAreaExample">
                    Type your message
                  </label>
                </div>
                <div className="actions">
                  <button disabled={!isJoinedSuccess} onClick={sendMessage}>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
