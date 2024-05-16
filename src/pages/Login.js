import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Form, Input, Typography } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate, useLocation } from "react-router-dom";
import { Actions } from "../components/store/reducer";
import { StoreContext } from "../components/store/store";
import Messages from "../messages";
import { loginAPI } from "../api/API";
import BeforeLoginAnime from "../assets/logoAnimeForward.mp4";
import AfterLoginAnime from "../assets/logoAnimeReverse.mp4";
import loginBackground from "../assets/login.png";
import "./Login.scss";

const { Text } = Typography;

const Login = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const [store, dispatch] = useContext(StoreContext);
  const [error, setError] = useState(null);
  const [anime, setAnime] = useState(null);
  const [playAnime, setPlayAnime] = useState(false);

  async function playAnimePeriod(anime, ms = 2000) {
    setAnime(anime);
    setPlayAnime(true);
    await new Promise((r) => setTimeout(r, ms));
  }

  // play before login anime
  useEffect(() => {
    (async () => {
      await playAnimePeriod(BeforeLoginAnime);
      setPlayAnime(false);
    })();
  }, []);

  useEffect(() => {
    if (store.account) loginComplete(location, navigate);
    else {
      const account = sessionStorage.getItem("account");
      if (account) dispatch({ type: Actions.SetAccount, payload: account });
    }
  }, [store.account, dispatch, location, navigate]);

  const onLogin = async ({ account, password }) => {
    const token = await loginAPI(account, password, store);
    if (token) {
      await playAnimePeriod(AfterLoginAnime);
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("account", account);
      dispatch({ type: Actions.SetAccount, payload: account });
      loginComplete(location, navigate);
    } else {
      setError(intl.formatMessage(Messages.Text_Login_FailMsg));
    }
  };
  return (
    <div>
      {playAnime ? (
        <div style={{ overflow: "hidden", lineHeight: 0 }}>
          <video autoPlay muted className="login-anime">
            <source src={anime} type="video/mp4" />
          </video>
        </div>
      ) : (
        <div className="login-main">
          <Form
            name="login"
            onFinish={(values) =>
              onLogin({ account: values.account, password: values.password })
            }
          >
            <Text className="login-form-text">
              <FormattedMessage {...Messages.Text_Login_Account} />
            </Text>
            <Form.Item name="account" rules={[{ required: true }]}>
              <Input
                placeholder={intl.formatMessage(
                  Messages.Text_Login_EnterAccount
                )}
                className="login-form-input"
              />
            </Form.Item>
            <Text className="login-form-text">
              <FormattedMessage {...Messages.Text_Login_Password} />
            </Text>
            <Form.Item name="password" rules={[{ required: true }]}>
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
          {error ? <Alert message={error} type="error" /> : null}
        </div>
      )}
    </div>
  );
};

export default Login;

function loginComplete(location, navigate) {
  // redirect to previous state or root
  const { from } = location.state || { from: { pathname: "/tv-wall" } };
  navigate(from);
}
