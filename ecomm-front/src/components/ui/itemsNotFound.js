import React from "react";
import { Box, Image, Text, Center } from "@chakra-ui/react";
import NoItemsImg from "./../../assets/noitems.jpeg";

const NoItemsComponent = () => {
  return (
    <Center py={10}>
      <Box textAlign="center">
        <Image
          src={NoItemsImg} // Update with the actual path to the image
          mx="auto"
          height="300px"
          width="300px"
          alt="No items available"
        />
      </Box>
    </Center>
  );
};

export default NoItemsComponent;
