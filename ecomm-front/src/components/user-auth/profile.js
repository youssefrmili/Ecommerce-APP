import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Divider,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  MdEmail,
  MdLocationOn,
  MdRMobiledata,
  MdSupervisedUserCircle,
  MdUsbOff,
} from "react-icons/md";
import { useCustomAuth } from "./authContext";
import { useHistory } from "react-router-dom";
import {
  Email,
  LocationCity,
  LocationOn,
  LocationSearching,
  ManageAccounts,
  PermScanWifiSharp,
  Person2,
} from "@mui/icons-material";

const user = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  location: "San Francisco, CA",
};

const ProfilePage = () => {
  const textColor = useColorModeValue("gray.700", "gray.200");
  const { appLogin, appLogout, appUser, isAppUserAuthenticated } =
    useCustomAuth();

  const [user, setUser] = useState();
  const history = useHistory();

  useEffect(() => {
    appUser()
      .then((user) => {
        if (user) {
          console.log("logged in user", user);
          setUser(user);
          // setIsAdmin(user.role === "ADMIN" ? true : false);
          // history.push("/home");
        } else {
          history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Flex align="center" justify="center" minHeight="15vh" padding={4}>
      {user && (
        <VStack
          spacing={4}
          alignItems="flex-start"
          maxWidth="400px"
          w="full"
          // bg={useColorModeValue("white", "gray.700")}
          boxShadow="lg"
          p={5}
          borderRadius="md"
        >
          <Heading size="xl" color={textColor}>
            {user.nickname}
          </Heading>
          <Divider my={4} />
          <Flex alignItems="center" gap={3}>
            <Icon as={Email} color="blue.500" mr={2} />
            <Text color={textColor}>{user.email}</Text>
          </Flex>
          <Flex alignItems="center" gap={3}>
            <Icon as={LocationOn} color="green.500" mr={2} />
            <Text color={textColor}>{user.location}</Text>
          </Flex>
          <Flex alignItems="center" gap={3}>
            <Icon as={ManageAccounts} color="red.500" mr={2} />
            <Text color={textColor}>{user.role}</Text>
          </Flex>
          <Flex alignItems="center" gap={3}>
            <Icon as={Person2} color="white.500" mr={2} />
            <Text color={textColor}>{user.sub}</Text>
          </Flex>
        </VStack>
      )}
    </Flex>
  );
};

export default ProfilePage;
