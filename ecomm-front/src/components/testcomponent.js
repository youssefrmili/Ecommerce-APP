import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useCustomAuth } from "./user-auth/authContext";

export const MyComponent = () => {
  const { appUser, isAppUserAuthenticated } = useCustomAuth();

  console.log("Custom User:", appUser());
  console.log("is user authenticated", isAppUserAuthenticated());

  // Rest of your component logic
};
