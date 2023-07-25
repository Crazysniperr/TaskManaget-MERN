import React, { useEffect, useState } from "react";
import classes from "./loginPage.module.css";
import emoji from "../../assets/gif1.gif";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "../../components/backButton/BackButton";
import Cookies from "js-cookie";
import { Loader1 } from "../../components/loader1";
import protect from "../../hooks/useProtect/useProtect.js";
import GoogleLogin from "react-google-login";

// const responseGoogle = async (response) => {
//   try {
//     window.location.href = 'http://localhost:8080/auth/google';
//   } catch (err) {
//     console.error(err);
//     alert("Google login failed.");
//   }
// };
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const CLIENT_ID = "976561223428-ea4kfd06pemgkht7ov4pnfrf9vo75fr0.apps.googleusercontent.com";


  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both username and password.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/users/login", {
        email,
        password,
      });

      localStorage.setItem("name", response.data.name);
      const { accessToken, refreshToken ,firstName} = response.data;

      Cookies.set("access", accessToken);
      Cookies.set("refresh", refreshToken);
      Cookies.set("name", firstName);
      navigate("/taskmanager");
    } catch (err) {
      console.error("An error occurred");
      alert("Wrong username or password.");
    } finally {
      setLoading(false);
    }
  };

  const responseGoogle = async () => {
    try {
      window.location.href = 'http://localhost:8080/auth/google';
    } catch (error) {
      console.error('Error fetching Google login response:', error);
    }
  };
  // useEffect(() => {
  //   handleGoogleResponse();
  // }, []);
  return (
    <>
      <BackButton className={classes.backButton} />

      <div className={classes.container}>
        <form className={classes.form_container} onSubmit={onSubmit}>
          <div className={classes.logo_container}>
            <img src={emoji} alt="emoji" />
          </div>
          <div className={classes.title_container}>
            <p className={classes.title}>Good to see you again! </p>
            <span className={classes.subtitle}>
              Welcome back to Listy, log in to your account and enjoy the
              experience.
            </span>
          </div>
          <br />
          <div className={classes.input_container}>
            <label className={classes.input_label} for="email_field">
              Email
            </label>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              height="24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              className={classes.icon}
            >
              <path
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="1.5"
                stroke="#141B34"
                d="M7 8.5L9.94202 10.2394C11.6572 11.2535 12.3428 11.2535 14.058 10.2394L17 8.5"
              ></path>
              <path
                stroke-linejoin="round"
                stroke-width="1.5"
                stroke="#141B34"
                d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z"
              ></path>
            </svg>
            <input
              placeholder="name@mail.com"
              title="Input title"
              name="input-name"
              type="text"
              className={classes.input_field}
              id="email_field"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={classes.input_container}>
            <label className={classes.input_label} for="password_field">
              Password
            </label>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              height="24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              className={classes.icon}
            >
              <path
                stroke-linecap="round"
                stroke-width="1.5"
                stroke="#141B34"
                d="M18 11.0041C17.4166 9.91704 16.273 9.15775 14.9519 9.0993C13.477 9.03404 11.9788 9 10.329 9C8.67911 9 7.18091 9.03404 5.70604 9.0993C3.95328 9.17685 2.51295 10.4881 2.27882 12.1618C2.12602 13.2541 2 14.3734 2 15.5134C2 16.6534 2.12602 17.7727 2.27882 18.865C2.51295 20.5387 3.95328 21.8499 5.70604 21.9275C6.42013 21.9591 7.26041 21.9834 8 22"
              ></path>
              <path
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="1.5"
                stroke="#141B34"
                d="M6 9V6.5C6 4.01472 8.01472 2 10.5 2C12.9853 2 15 4.01472 15 6.5V9"
              ></path>
              <path
                fill="#141B34"
                d="M21.2046 15.1045L20.6242 15.6956V15.6956L21.2046 15.1045ZM21.4196 16.4767C21.7461 16.7972 22.2706 16.7924 22.5911 16.466C22.9116 16.1395 22.9068 15.615 22.5804 15.2945L21.4196 16.4767ZM18.0228 15.1045L17.4424 14.5134V14.5134L18.0228 15.1045ZM18.2379 18.0387C18.5643 18.3593 19.0888 18.3545 19.4094 18.028C19.7299 17.7016 19.7251 17.1771 19.3987 16.8565L18.2379 18.0387ZM14.2603 20.7619C13.7039 21.3082 12.7957 21.3082 12.2394 20.7619L11.0786 21.9441C12.2794 23.1232 14.2202 23.1232 15.4211 21.9441L14.2603 20.7619ZM12.2394 20.7619C11.6914 20.2239 11.6914 19.358 12.2394 18.82L11.0786 17.6378C9.86927 18.8252 9.86927 20.7567 11.0786 21.9441L12.2394 20.7619ZM12.2394 18.82C12.7957 18.2737 13.7039 18.2737 14.2603 18.82L15.4211 17.6378C14.2202 16.4587 12.2794 16.4587 11.0786 17.6378L12.2394 18.82ZM14.2603 18.82C14.8082 19.358 14.8082 20.2239 14.2603 20.7619L15.4211 21.9441C16.6304 20.7567 16.6304 18.8252 15.4211 17.6378L14.2603 18.82ZM20.6242 15.6956L21.4196 16.4767L22.5804 15.2945L21.785 14.5134L20.6242 15.6956ZM15.4211 18.82L17.8078 16.4767L16.647 15.2944L14.2603 17.6377L15.4211 18.82ZM17.8078 16.4767L18.6032 15.6956L17.4424 14.5134L16.647 15.2945L17.8078 16.4767ZM16.647 16.4767L18.2379 18.0387L19.3987 16.8565L17.8078 15.2945L16.647 16.4767ZM21.785 14.5134C21.4266 14.1616 21.0998 13.8383 20.7993 13.6131C20.4791 13.3732 20.096 13.1716 19.6137 13.1716V14.8284C19.6145 14.8284 19.619 14.8273 19.6395 14.8357C19.6663 14.8466 19.7183 14.8735 19.806 14.9391C19.9969 15.0822 20.2326 15.3112 20.6242 15.6956L21.785 14.5134ZM18.6032 15.6956C18.9948 15.3112 19.2305 15.0822 19.4215 14.9391C19.5091 14.8735 19.5611 14.8466 19.5879 14.8357C19.6084 14.8273 19.6129 14.8284 19.6137 14.8284V13.1716C19.1314 13.1716 18.7483 13.3732 18.4281 13.6131C18.1276 13.8383 17.8008 14.1616 17.4424 14.5134L18.6032 15.6956Z"
              ></path>
            </svg>
            <input
              placeholder="Password"
              title="Input title"
              name="input-name"
              type="password"
              className={classes.input_field}
              id="password_field"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* <Link className={classes.Link} to="/taskmanager"> */}
          <button title="Sign In" type="submit" className={classes.sign_in_btn}>
            {loading ? (
              <div className={classes.loader}>
                <Loader1 />
              </div>
            ) : (
              <span>Log In</span>
            )}
          </button>
          {/* </Link> */}

          <div className={classes.separator}>
            <hr className={classes.line} />
            <span>Or</span>
            <hr className={classes.line} />
          </div>
          
          <button title="Sign In" type="button" className={classes.sign_in_ggl} onClick={responseGoogle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              preserveAspectRatio="xMidYMid"
              viewBox="0 0 256 262"
              id="google"
            >
              <path
                fill="#4285F4"
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
              ></path>
              <path
                fill="#34A853"
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
              ></path>
              <path
                fill="#FBBC05"
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
              ></path>
              <path
                fill="#EB4335"
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
              ></path>
            </svg>
            <span>Continue with Google</span>
          </button>

          <Link className={classes.Link} to="/user">
            <button title="Sign In" className={classes.sign_in_apl}>
              <span>
                First time using Listy? <b>Register</b> 😍
              </span>
            </button>
          </Link>
          <p className={classes.note}>Terms of use &amp; Conditions</p>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
