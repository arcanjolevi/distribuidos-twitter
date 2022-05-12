import React, { createContext, useState, useEffect, useContext } from "react";
import mqtt from "mqtt";
import AuthContext from "./AuthContext";
const MqttContext = createContext();

const MqttContextProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [connectStatus, setConnectStatus] = useState(false);
  const [msgBuffer, setMsgBuffer] = useState(null);
  const [queueBuffer, setQueueBuffer] = useState(null);
  const [tweetsList, setTweetsList] = useState([]);

  const { user, isAuthenticated } = useContext(AuthContext);

  const mqttConnect = (host, mqttOption) => {
    // setConnectStatus("Connecting");
    setClient(mqtt.connect(host, mqttOption));
  };
  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        setConnectStatus(true);
      });
      client.on("error", (err) => {
        console.error("Connection error: ", err);
        client.end();
      });
      client.on("reconnect", () => {
        setConnectStatus("Reconnecting");
      });
      client.on("message", (topic, message) => {
        const payload = { topic, message: message.toString() };
        const payloadMessage = payload.message.split("&");

        if (topic === "feed") {
          setMsgBuffer({
            msg: payloadMessage[0],
            userName: payloadMessage[1],
            userEmail: payloadMessage[2],
            photoUrl: payloadMessage[3],
            timestamp: payloadMessage[4],
          });
        }
        if (topic === "messages/queue") {
          const queue = payload.message.split("¿");
          console.log(queue);
          setQueueBuffer(queue);
        }
      });
    }
  }, [client]);

  function publishInFeed(msg) {
    client.subscribe("feed", function (err) {
      if (!err) {
        client.publish(
          "feed",
          `${msg}&${user.displayName}&${user.email}&${
            user.photoURL
          }&${Date.now()}`
        );
      }
    });
  }

  function publishNewConnection(msg) {
    client.subscribe("connection/new", function (err) {
      if (!err) {
        client.publish("connection/new", `${user.email}`);
      }
    });

    client.subscribe("messages/queue", function (err) {
      if (err) {
        console.log(err);
      }
    });
  }

  function connectMqtt() {
    mqttConnect("mqtt://179.106.206.29:9001");
  }

  useEffect(() => {
    if (!!msgBuffer) {
      setTweetsList((t) => [msgBuffer, ...t]);
    }
  }, [msgBuffer]);

  useEffect(() => {
    if (!!queueBuffer) {
      const list = [];
      queueBuffer.forEach((item) => {
        const payloadMessage = item.split("&");
        list.unshift({
          msg: payloadMessage[0],
          userName: payloadMessage[1],
          userEmail: payloadMessage[2],
          photoUrl: payloadMessage[3],
          timestamp: payloadMessage[4],
        });
      });
      setTweetsList(list);
    }
  }, [queueBuffer]);

  useEffect(() => {
    if (isAuthenticated) {
      connectMqtt();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (connectStatus) {
      publishNewConnection();
    }
  }, [connectStatus]);
  return (
    <MqttContext.Provider
      value={{
        connectStatus,
        connectMqtt,
        publishInFeed,
        tweetsList,
      }}
    >
      {children}
    </MqttContext.Provider>
  );
};
export { MqttContextProvider };
export default MqttContext;
