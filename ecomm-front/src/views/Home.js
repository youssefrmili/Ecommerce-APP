import React, { Fragment, useEffect, useState } from "react";

import Hero from "../components/ui/Hero";
import Content from "../components/Content";
import { useAuth0 } from "@auth0/auth0-react";
import { useCustomAuth } from "../components/user-auth/authContext";
import history from "../utils/history";

const Home = () => {
  const [loggedInUser, setLoggedInUser] = useState();
  const { user, isLoading, error } = useAuth0();
  const { appUser } = useCustomAuth();

  useEffect(() => {
    // appUser()
    //   .then((user) => {
    //     if (user) {
    //       history.push("/home");
    //     } else {
    //       history.push("/login");
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, []);

  return (
    <Fragment>
      <Hero />
      <hr />
      <Content />
    </Fragment>
  );
};

export default Home;
