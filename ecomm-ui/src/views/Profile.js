import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";

import Highlight from "../components/ui/Highlight";
import Loading from "../components/ui/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { useCustomAuth } from "../components/user-auth/authContext";

export const ProfileComponent = () => {
  const [loggedInUser, setLoggedInUser] = useState();
  const { user } = useAuth0();
  const { appUser } = useCustomAuth();

  useEffect(() => {
    const loggedUser = appUser() ? appUser() : user;
    if (loggedUser) {
      setLoggedInUser(loggedUser);
    }
  }, []);

  return (
    <Container className="mb-5">
      {loggedInUser && (
        <>
          <Row className="align-items-center profile-header mb-5 text-center text-md-left">
            <Col md={2}>
              <img
                src={loggedInUser.picture}
                alt="Profile"
                className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
              />
            </Col>
            <Col md>
              <h2>{loggedInUser.name}</h2>
              <p className="lead text-muted">{user.email}</p>
            </Col>
          </Row>
          <Row>
            <Highlight>{JSON.stringify(loggedInUser, null, 2)}</Highlight>
          </Row>
        </>
      )}
    </Container>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
