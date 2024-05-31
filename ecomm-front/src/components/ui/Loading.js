import React, { useEffect } from "react";
import loading from "../../assets/loading.svg";
import { useAuth0 } from "@auth0/auth0-react";

const Loading = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const getToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        console.log("Access Token:", accessToken);
        // You can now use this access token to make API calls
      } catch (error) {
        console.error("Error getting access token:", error);
      }
    };

    // getToken();
  }, [getAccessTokenSilently]);

  return (
    <div className="spinner">
      <img src={loading} alt="Loading" />
      {/* {getAccessToken()} */}
    </div>
  );
};
export default Loading;
