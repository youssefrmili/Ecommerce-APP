import {
  Box,
  Flex,
  HStack,
  useDisclosure,
  useColorModeValue,
  Stack,
  Link,
  Button,
} from "@chakra-ui/react";
import {
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { NavLink as RouterNavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { IconButton } from "@chakra-ui/react";
// import { ShoppingCartTwoTone } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "./../../assets/logo.png";
import { useCustomAuth } from "../user-auth/authContext";
import Avatar from "@mui/material/Avatar";
import { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import theme from "../../theme";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import CartService from "../../api/cartService";
// import { CartIconButtonWithBadge } from "./cartIcon";
import { ShoppingCart } from "@mui/icons-material";
import Badge, { BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import CartIconButton from "./cartIcon";

const Links = [
  { link: "Home", href: "/" },
  { link: "Products", href: "/product" },
];

const adminLinks = [
  { link: "Add Product", href: "/add-product" },
  { link: "Events", href: "/events" },
];

export const NavbarChakra = ({ count }) => {
  console.log("Count in NavbarChakra:", count);
  const defaultTheme = createTheme();
  const fontSize = theme.typography.pxToRem(24);
  const history = useHistory();
  const [loggedInUser, setLoggedInUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const { appLogin, appLogout, appUser, isAppUserAuthenticated } =
    useCustomAuth();
  const location = useLocation();
  // const [count, setCount] = useState(0);

  const register = () => {
    history.push("/register");
  };

  useEffect(() => {
    appUser()
      .then((user) => {
        if (user) {
          console.log("logged in user", user);
          setLoggedInUser(user);
          // setCartItemsCount();
          setIsAdmin(user.role === "ADMIN" ? true : false);
          history.push("/home");
        } else {
          history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.charAt(0)}`,
    };
  }

  const logoutWithRedirect = () => {
    // logout({
    //   logoutParams: {
    //     returnTo: window.location.origin,
    //   },
    appLogout();
  };

  const activeLinkStyle = {
    backgroundColor: "lightgrey", // Light grey background
    fontWeight: "bold", // Bold text
    color: "blue", // Blue text color
    textDecoration: "none", // No underline
  };

  const inactiveLinkStyle = {
    textDecoration: "none", // No underline for inactive links
    color: "inherit", // Default text color
  };

  return (
    <>
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
        position="sticky" // Makes the navbar sticky
        top={0} // Position it at the top of the viewport
        zIndex={1} // Ensure it's above other content; adjust as needed
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>
              <img
                src={Logo}
                alt="Logo"
                className="nav-user-profile rounded-circle"
                width="38"
              />
            </Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {loggedInUser &&
                Links.map((item) => (
                  <NavLink
                    as={RouterNavLink}
                    tag={RouterNavLink}
                    to={item.href}
                    exact
                    activeClassName="router-link-exact-active"
                    style={
                      location.pathname === item.href
                        ? activeLinkStyle
                        : inactiveLinkStyle
                    }
                  >
                    {item.link}
                  </NavLink>
                ))}

              {isAdmin &&
                adminLinks.map((item) => (
                  <NavLink
                    tag={RouterNavLink}
                    to={item.href}
                    exact
                    activeClassName="router-link-exact-active"
                    style={
                      location.pathname === item.href
                        ? activeLinkStyle
                        : inactiveLinkStyle
                    }
                  >
                    {item.link}
                  </NavLink>
                ))}
            </HStack>
          </HStack>

          <Nav className="d-none d-md-block" navbar>
            {!loggedInUser && (
              <NavItem>
                <Button
                  id="qsLoginBtn"
                  color="primary"
                  className="btn-margin"
                  // onClick={() => loginWithRedirect()}
                  onClick={register}
                >
                  Register
                </Button>
              </NavItem>
            )}
          </Nav>
          {loggedInUser && (
            <Flex h={6} alignItems={"center"} justifyContent={"space-between"}>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret id="profileDropDown">
                  {/* <img
                    src={user.picture}
                    alt="Profile"
                    className="nav-user-profile rounded-circle"
                    width="38"
                  /> */}
                  <ThemeProvider theme={theme}>
                    <Avatar {...stringAvatar(loggedInUser.name)} />
                  </ThemeProvider>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>{loggedInUser.name}</DropdownItem>
                  <DropdownItem
                    tag={RouterNavLink}
                    to="/profile"
                    className="dropdown-profile"
                    activeClassName="router-link-exact-active"
                  >
                    <FontAwesomeIcon icon="user" className="mr-3" /> Profile
                  </DropdownItem>
                  <DropdownItem
                    id="qsLogoutBtn"
                    onClick={() => logoutWithRedirect()}
                  >
                    <FontAwesomeIcon icon="power-off" className="mr-3" /> Log
                    out
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <Nav>
                <NavItem>
                  <NavLink
                    tag={RouterNavLink}
                    to="/cart"
                    exact
                    // activeClassName="router-link-exact-active"
                  >
                    <CartIconButton count={count} />
                  </NavLink>
                </NavItem>
              </Nav>
            </Flex>
          )}

          {/* {!loggedInUser && (
            <Nav className="d-md-none" navbar>
              <NavItem>
                <Button
                  id="qsLoginBtn"
                  color="primary"
                  block
                  // onClick={() => loginWithRedirect({})}
                  onClick={register}
                >
                  Register
                </Button>
              </NavItem>
            </Nav>
          )} */}
        </Flex>
        {/* </Flex> */}

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};
