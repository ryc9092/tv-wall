import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Input, Typography } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate, useLocation } from "react-router-dom";
import { Actions } from "../components/store/reducer";
import { StoreContext } from "../components/store/store";
import Messages from "../messages";
import { login } from "../api/API";
import { showWarningNotification } from "../utils/Utils";
import AfterLoginAnime from "../assets/logoAnimeReverse.mp4";
import loginBackground from "../assets/loginBackground.png";
import afterLoginBackground from "../assets/afterLoginBackground.png";
import afterLoginLogo from "../assets/afterLoginLogo.png";
import WJLogo from "../assets/WJLogo.png";
import { jwtDecode } from "jwt-decode";
import "./Login.scss";

const { Text } = Typography;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

var myopacity = 0;
function MyFadeFunction() {
  if (myopacity < 1) {
    myopacity += 0.075;
    setTimeout(function () {
      MyFadeFunction();
    }, 100);
  }
  document.getElementById("after-login-logo").style.opacity = myopacity;
}

const Login = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const [store, dispatch] = useContext(StoreContext);
  const [anime, setAnime] = useState(null);
  const [playAnime, setPlayAnime] = useState(false);
  const [alreadyPlayedAnime, setAlreadyPlayedAnime] = useState(false);

  async function startToPlayAnime(anime) {
    setAnime(anime);
    setPlayAnime(true);
  }

  // check if anime already played
  useEffect(() => {
    (async () => {
      if (playAnime) {
        MyFadeFunction();
        await sleep(1600);
        setAlreadyPlayedAnime(true);
        // const video = document.getElementById("video");
        // video.addEventListener(
        //   "ended",
        //   (e) => {
        //     setAlreadyPlayedAnime(true);
        //   },
        //   false
        // );
      }
    })();
  }, [playAnime]);

  useEffect(() => {
    // After play anime finished, reset Already Played Anime to false
    if (sessionStorage.getItem("token") && alreadyPlayedAnime) {
      // Navigate: login completed and play anime finished
      setAlreadyPlayedAnime(false);
      loginComplete(location, navigate);
    } else if (!sessionStorage.getItem("token") && alreadyPlayedAnime) {
      // Stop anime: login not completed and play anime finished
      setAlreadyPlayedAnime(false);
      setPlayAnime(false);
    }
  }, [location, navigate, alreadyPlayedAnime]);

  const onLogin = async ({ account, password }) => {
    const jwtToken = await login(account, password, store);
    if (jwtToken) {
      startToPlayAnime(AfterLoginAnime);
      const decodedJwt = jwtDecode(jwtToken);
      sessionStorage.setItem("token", jwtToken);
      sessionStorage.setItem("account", account);
      sessionStorage.setItem("role", decodedJwt.role);
      dispatch({ type: Actions.SetAccount, payload: account });
    } else {
      showWarningNotification(
        intl.formatMessage(Messages.Text_Login_FailMsg),
        Math.random()
      );
    }
  };

  return (
    <div style={{ backgroundColor: "black" }}>
      {playAnime ? (
        <div
          id="test"
          className="container"
          style={{ backgroundImage: `url(${afterLoginBackground})` }}
        >
          <img
            id="after-login-logo"
            src={afterLoginLogo}
            alt="logo"
            className="after-login-logo"
            // style={{ width: "100px", height: "100px" }}
          />
        </div>
      ) : (
        <div
          className="container"
          style={{ backgroundImage: `url(${loginBackground})` }}
        >
          <div className="login-form-container-background" />
          <div className="login-form-container">
            <div className="login-logo-container">
              <img
                src={WJLogo}
                alt="logo"
                className="login-logo"
                // style={{ width: "100px", height: "100px" }}
              />
            </div>
            <Form
              name="login"
              onFinish={(values) =>
                onLogin({
                  account: values.account,
                  password: values.password,
                })
              }
            >
              <Form.Item
                name="account"
                label={
                  <Text className="login-form-text">
                    <FormattedMessage {...Messages.Text_Login_Account} />
                  </Text>
                }
                colon={false}
              >
                <Input
                  placeholder={intl.formatMessage(
                    Messages.Text_Login_EnterAccount
                  )}
                  className="login-form-input"
                />
              </Form.Item>
              <Form.Item
                name="password"
                label={
                  <Text className="login-form-text">
                    <FormattedMessage {...Messages.Text_Login_Password} />
                  </Text>
                }
                colon={false}
              >
                <Input.Password
                  placeholder={intl.formatMessage(
                    Messages.Text_Login_EnterPassword
                  )}
                  className="login-form-input"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  {intl.formatMessage(Messages.Text_Login_ButtonLogin)}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

function loginComplete(location, navigate) {
  // redirect to previous state or default route
  const { from } = location.state || { from: { pathname: "/situation" } };
  navigate(from);
}
