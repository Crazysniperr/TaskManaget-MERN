import Cookies from "js-cookie";
import axios from "axios";

const refresh = async (refreshToken) => {
  console.log("Refreshing token!");

  try {
    const response = await axios.post("http://localhost:8080/users/refresh", { token: refreshToken });

    if (response.data.success === false) {
      return null;
    } else {
      const { accessToken } = response.data;
      Cookies.set("access", accessToken);
      return accessToken;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
const requestLogin = async (accessToken, refreshToken) => {
  console.log(accessToken, refreshToken);

  try {
    const response = await axios.post(
      "http://localhost:8080/users/protect",
      {},
      { headers: { authorization: `Bearer ${accessToken}` } }
    );

    if (response.data.success === false) {
      if (response.data.message === "User not authenticated") {
        throw new Error("User not authenticated");
      } else if (response.data.message === "Access token expired") {
        const newAccessToken = await refresh(refreshToken);
        if (newAccessToken) {
          return await requestLogin(newAccessToken, refreshToken);
        } else {
          throw new Error("Failed to refresh access token");
        }
      }
    }

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const hasAccess = async (accessToken, refreshToken) => {
  if (!refreshToken) {
    return null;
  }

  if (!accessToken) {
    try {
      accessToken = await refresh(refreshToken);
      return accessToken;
    } catch (error) {
      return null;
    }
  }

  return accessToken;
};

const protect = async (navigate, accessToken, refreshToken) => {
  try {
    accessToken = await hasAccess(accessToken, refreshToken);

    if (!accessToken) {
      navigate("/user/login");
    } else {
      try {
        const success = await requestLogin(accessToken, refreshToken);
        if (!success) {
          navigate("/user/login");
        }
      } catch (error) {
        navigate("/user/login");
      }
    }
  } catch (error) {
    navigate("/user/login");
  }
};


export default protect;
