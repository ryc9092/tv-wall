import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Form, Input, Typography } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate, useLocation } from "react-router-dom";
import { Actions } from "../components/store/reducer";
import { StoreContext } from "../components/store/store";
import Messages from "../messages";
import { loginAPI } from "../api/API";

const { Text } = Typography;

const Login = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const [store, dispatch] = useContext(StoreContext);
  const [error, setError] = useState(null);

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
      <Form
        name="login"
        onFinish={(values) =>
          onLogin({ account: values.account, password: values.password })
        }
      >
        <Text>
          <FormattedMessage {...Messages.Text_Login_Account} />
        </Text>
        <Form.Item name="account" rules={[{ required: true }]}>
          <Input
            placeholder={intl.formatMessage(Messages.Text_Login_EnterAccount)}
          />
        </Form.Item>
        <Text>
          <FormattedMessage {...Messages.Text_Login_Password} />
        </Text>
        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password
            placeholder={intl.formatMessage(Messages.Text_Login_EnterPassword)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {intl.formatMessage(Messages.Text_Login_ButtonLogin)}
          </Button>
        </Form.Item>
      </Form>
      {error ? <Alert message={error} type="error" /> : null}
    </div>
  );
};

export default Login;

function loginComplete(location, navigate) {
  // redirect to previous state or root
  const { from } = location.state || { from: { pathname: "/tv-wall" } };
  navigate(from);
}
