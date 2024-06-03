import { useToast } from "@chakra-ui/toast";
import React from "react";

const Toast = (props) => {
  const { title, description, status, duration, isClosable } = props;
  const toast = useToast();
  return (
    <Button
      onClick={() =>
        toast({
          title: title || "Item created.",
          description: description || "We've created your item.",
          status: status || "success",
          duration: duration || 4000,
          isClosable: isClosable || true,
        })
      }
    >
      Show Toast
    </Button>
  );
};

Toast.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  status: PropTypes.string,
  duration: PropTypes.number,
  isClosable: PropTypes.bool,
};

export default Toast;
