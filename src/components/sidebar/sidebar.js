import { Button, Menu, Select, Typography } from "antd";
import { useContext, useState } from "react";
import { SIDEBAR_WIDTH } from "../../layouts/responsiveLayout";
import { useNavigate } from "react-router-dom";
import { Actions } from "../store/reducer";
import { StoreContext } from "../store/store";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../messages";
import TVWallIcon from "../../assets/tvWall.png";
import SingleScreenIcon from "../../assets/screen.png";
import USBIcon from "../../assets/usb.png";
import AudioIcon from "../../assets/audio.png";
import SituationIcon from "../../assets/situation.png";
import StatusIcon from "../../assets/status.png";
import SettingIcon from "../../assets/setting.png";
import "./sidebar.scss";

const bulletPoint = "\u25CF";
const MenuItem = ({ item }) => {
  return <div style={{ fontSize: 16 }}>{item}</div>;
};

const Sidebar = ({ setLocale, siderCollapse }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const currentPath = window.location.pathname.substring(1);
  const [store, dispatch] = useContext(StoreContext);
  const [sideBarMenuKey, setSideBarMenuKey] = useState(
    currentPath === "tv-wall" ? "tv-wall" : currentPath
  );

  const items = [
    {
      key: "tv-wall",
      label: (
        <MenuItem
          item=<span className="menu-text">
            {intl.formatMessage(Messages.Text_Sidebar_TVWallManagement)}
          </span>
        />
      ),
      icon: <img src={TVWallIcon} alt="tvwall" className="menu-icon" />,
    },
    {
      key: "single-screen",
      label: (
        <MenuItem
          item=<span className="menu-text">
            {intl.formatMessage(Messages.Text_Sidebar_SingleScreenManagement)}
          </span>
        />
      ),
      icon: (
        <img src={SingleScreenIcon} alt="singlescreen" className="menu-icon" />
      ),
    },
    {
      key: "usb",
      label: (
        <MenuItem
          item=<span className="menu-text">
            {intl.formatMessage(Messages.Text_Sidebar_USBManagement)}
          </span>
        />
      ),
      icon: <img src={USBIcon} alt="usb" className="menu-icon" />,
    },
    // {
    //   key: "rs232",
    //   label: (
    //     <MenuItem
    //       item={intl.formatMessage(Messages.Text_Sidebar_RS232Management)}
    //     />
    //   ),
    // },
    {
      key: "audio",
      label: (
        <MenuItem
          item=<span className="menu-text">
            {intl.formatMessage(Messages.Text_Sidebar_AudioManagement)}
          </span>
        />
      ),
      icon: <img src={AudioIcon} alt="audio" className="menu-icon" />,
    },
    {
      key: "situation",
      label: (
        <MenuItem
          item=<span className="menu-text">
            {intl.formatMessage(Messages.Text_Sidebar_SituationManagement)}
          </span>
        />
      ),
      icon: <img src={SituationIcon} alt="situation" className="menu-icon" />,
    },
    // {
    //   key: "schedule",
    //   label: (
    //     <MenuItem
    //       item={intl.formatMessage(Messages.Text_Sidebar_ScheduleManagement)}
    //     />
    //   ),
    // },
    {
      key: "equipment-status",
      label: (
        <MenuItem
          item=<span className="menu-text">
            {intl.formatMessage(Messages.Text_Sidebar_DeviceStatus)}
          </span>
        />
      ),
      icon: <img src={StatusIcon} alt="status" className="menu-icon" />,
    },
    // {
    //   key: "event",
    //   label: (
    //     <MenuItem
    //       item={intl.formatMessage(Messages.Text_Sidebar_EventAndAlarm)}
    //     />
    //   ),
    //   icon: <img src={TVWallIcon} alt="tvwall" className="menu-icon" />,
    // },
    {
      key: "setting",
      label: (
        <MenuItem
          item=<span className="menu-text">
            {intl.formatMessage(Messages.Text_Sidebar_SystemSetting)}
          </span>
        />
      ),
      icon: <img src={SettingIcon} alt="setting" className="menu-icon" />,
    },
  ];

  const onLogout = () => {
    dispatch({ type: Actions.Logout, payload: null });
    navigate("/login");
  };

  const onNavigate = (e) => {
    const path = e.key;
    setSideBarMenuKey(path);
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
    <div>
      <div style={{ marginTop: 10 }}>
        <Menu
          selectedKeys={[sideBarMenuKey]}
          mode="inline"
          items={items}
          style={{ border: "0 solid white", backgroundColor: "#e7e7e7" }}
          onClick={onNavigate}
        />
      </div>
      {/* <div
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
      </div> */}
    </div>
  );
};

export default Sidebar;
