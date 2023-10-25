import React, { useContext, useEffect } from "react";
import { Button, Form, Input, Typography } from "antd";
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

  useEffect(() => {
    if (store.account) loginComplete(location, navigate);
    else {
      const account = sessionStorage.getItem("account");
      if (account) dispatch({ type: Actions.SetAccount, payload: account });
    }
  }, [store.account, dispatch, location, navigate]);

  const onLogin = ({ account, password }) => {
    signIn(account, password, dispatch, navigate, location);
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
        <Form.Item
          name="account"
          rules={[{ required: true }]}
          style={{ marginBottom: "20px" }}
        >
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
    </div>
  );
};

export default Login;

async function signIn(account, password, dispatch, navigate, location) {
  const token = await loginAPI(account, password);
  if (token) {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("account", account);
    dispatch({ type: Actions.SetAccount, payload: account });
    loginComplete(location, navigate);
  }
}

function loginComplete(location, navigate) {
  // redirect to previous state or root
  const { from } = location.state || { from: { pathname: "/" } };
  navigate(from);
}
