import { Heading, List, ListIcon, ListItem, Text } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";

const socketURL = process.env.REACT_APP_WS_BASE_URL;

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const socket = new WebSocket(socketURL);

    socket.onopen = () => {
      console.log("WebSocket Connected");
    };

    socket.onmessage = (event) => {
      if (event.data === "connected") {
      } else {
        setEvents((prevEvents) => [...prevEvents, JSON.parse(event.data)]);
      }

      console.log("Message from server ", event.data);
    };

    // Cleanup on unmount
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <Heading marginBottom={8}> Server events </Heading>
      <List spacing={3}>
        {events.length > 0 &&
          events.map((item) => (
            <ListItem>
              <ListIcon color="green.500" />
              {item.message}
            </ListItem>
          ))}
      </List>
    </div>
  );
};

export default Events;
