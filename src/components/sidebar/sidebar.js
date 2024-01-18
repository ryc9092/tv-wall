import { Button, Menu, Select, Typography } from "antd";
import { useContext } from "react";
import { SIDEBAR_WIDTH } from "../../layouts/responsiveLayout";
import { useNavigate } from "react-router-dom";
import { Actions } from "../store/reducer";
import { StoreContext } from "../store/store";
import Logo from "../../assets/ipec.png";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../messages";
import "./sidebar.scss";

const bulletPoint = "\u25CF";
const MenuItem = ({ item }) => {
  return (
    <div style={{ fontSize: 16 }}>
      {bulletPoint} {item}
    </div>
  );
};

const Sidebar = ({ setLocale }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [store, dispatch] = useContext(StoreContext);

  const items = [
    {
      key: "equipment-status",
      label: (
        <MenuItem
          item={intl.formatMessage(Messages.Text_Sidebar_DeviceStatus)}
        />
      ),
    },
    {
      key: "tv-wall",
      label: (
        <MenuItem
          item={intl.formatMessage(Messages.Text_Sidebar_TVWallManagement)}
        />
      ),
    },
    {
      key: "single-screen",
      label: (
        <MenuItem
          item={intl.formatMessage(
            Messages.Text_Sidebar_SingleScreenManagement
          )}
        />
      ),
    },
    {
      key: "usb",
      label: (
        <MenuItem
          item={intl.formatMessage(Messages.Text_Sidebar_USBManagement)}
        />
      ),
    },
    {
      key: "rs232",
      label: (
        <MenuItem
          item={intl.formatMessage(Messages.Text_Sidebar_RS232Management)}
        />
      ),
    },
    {
      key: "schedule",
      label: (
        <MenuItem
          item={intl.formatMessage(Messages.Text_Sidebar_ScheduleManagement)}
        />
      ),
    },
    {
      key: "situation",
      label: (
        <MenuItem
          item={intl.formatMessage(Messages.Text_Sidebar_SituationManagement)}
        />
      ),
    },
    {
      key: "event",
      label: (
        <MenuItem
          item={intl.formatMessage(Messages.Text_Sidebar_EventAndAlarm)}
        />
      ),
    },
    {
      key: "setting",
      label: (
        <MenuItem
          item={intl.formatMessage(Messages.Text_Sidebar_SystemSetting)}
        />
      ),
    },
  ];

  const onLogout = () => {
    dispatch({ type: Actions.Logout, payload: null });
    navigate("/login");
  };

  const onNavigate = (e) => {
    const path = e.key;
    navigate(`/${path}`);
  };

  const languageOptions = [
    {
      value: "zh-TW",
      label: intl.formatMessage(Messages.Text_Sidebar_Chinese),
    },
    {
      value: "en-US",
      label: intl.formatMessage(Messages.Text_Sidebar_English),
    },
  ];

  return (
    <div style={{ width: SIDEBAR_WIDTH }}>
      <div style={{ top: 6, left: 6, position: "absolute" }}>
        <img src={Logo} style={{ cursor: "pointer" }} alt="IPEC" width={100} />
      </div>
      <div style={{ marginTop: 120, marginLeft: -15 }}>
        <Menu
          defaultSelectedKeys={["tv-wall"]}
          mode="inline"
          items={items}
          style={{ border: "0 solid white" }}
          onClick={onNavigate}
        />
      </div>
      <div
        style={{ position: store.siderCollapse ? "relative" : "absolute" }}
        className="logout-btn"
      >
        <Typography.Text style={{ fontSize: 16 }}>
          <span style={{ marginRight: 10 }}>
            {bulletPoint}{" "}
            <FormattedMessage {...Messages.Text_Sidebar_Language} />
          </span>
          <Select
            style={{ width: 100 }}
            options={languageOptions}
            value={intl.locale}
            onChange={setLocale}
          ></Select>
        </Typography.Text>
        <br />
        <Typography.Text style={{ fontSize: 16 }}>
          {bulletPoint} {store.account}
          <Button type="text" style={{ fontSize: 16 }} onClick={onLogout}>
            <FormattedMessage {...Messages.Text_Sidebar_Logout} />
          </Button>
        </Typography.Text>
      </div>
    </div>
  );
};

export default Sidebar;
