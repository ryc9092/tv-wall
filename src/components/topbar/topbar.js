import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../store/store";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../messages";
import { Actions } from "../store/reducer";
import { Button, Divider, Dropdown, theme } from "antd";
import { LANGUAGE_LOCALE_MAP } from "../../utils/Constant";
import Logo from "../../assets/IPEC-Logo.png";
import ListIcon from "../../assets/list.png";
import UserIcon from "../../assets/user.png";
import BellIcon from "../../assets/bell.png";
import UserImage from "../../assets/userCircle.png";
import "./topbar.scss";

function TopBar({ setLocale }) {
  const intl = useIntl();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [store, dispatch] = useContext(StoreContext);

  const onSiderCollapse = () => {
    dispatch({ type: Actions.SetSiderCollapse, payload: !store.siderCollapse });
  };

  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const setLanguage = async (event) => {
    setLocale(LANGUAGE_LOCALE_MAP[event.key]);
  };

  const items = [
    {
      key: "1",
      type: "group",
      label: (
        <span style={{ fontSize: "14px" }}>
          {intl.formatMessage(Messages.Text_Sidebar_Language)}
        </span>
      ),
      children: [
        {
          key: "chinese",
          label: (
            <span className="topbar-user-menu-text">
              {intl.formatMessage(Messages.Text_Sidebar_Chinese)}
            </span>
          ),
          onClick: setLanguage,
        },
        {
          key: "english",
          value: "en-US",
          label: (
            <span className="topbar-user-menu-text">
              {intl.formatMessage(Messages.Text_Sidebar_English)}
            </span>
          ),
          onClick: setLanguage,
        },
      ],
    },
  ];

  const menuStyle = {
    boxShadow: "none",
  };

  const onLogout = () => {
    dispatch({ type: Actions.Logout, payload: null });
    navigate("/login");
  };

  return (
    <div className="topbar-fixed">
      <span className="topbar-container">
        <img
          src={ListIcon}
          alt="list"
          className="topbar-list-icon"
          onClick={onSiderCollapse}
        />
        <img src={Logo} alt="logo" className="topbar-logo" />
      </span>
      <span style={{ position: "absolute", right: 0 }}>
        <img src={BellIcon} alt="bell" className="topbar-function-icon" />
        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          dropdownRender={(menu) => (
            <div style={contentStyle}>
              <div className="topbar-user-menu-account">
                <img
                  alt="user"
                  src={UserImage}
                  className="topbar-user-menu-icon"
                />
                {store.account}
              </div>
              <Divider
                style={{
                  margin: 0,
                }}
              />
              {React.cloneElement(menu, {
                style: menuStyle,
              })}
              <Divider
                style={{
                  margin: 0,
                }}
              />
              <Button
                danger
                type="text"
                style={{
                  fontSize: 16,
                  margin: "2px 6px 6px 4px",
                  width: 150,
                  textAlign: "left",
                }}
                onClick={onLogout}
              >
                <FormattedMessage {...Messages.Text_Sidebar_Logout} />
              </Button>
            </div>
          )}
        >
          <img src={UserIcon} alt="user" className="topbar-function-icon" />
        </Dropdown>
      </span>
    </div>
  );
}

export default TopBar;
