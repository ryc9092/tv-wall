import { Menu } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import Messages from "../../messages";
import TVWallIcon from "../../assets/tvWall.png";
import SingleScreenIcon from "../../assets/screen.png";
import PowerIcon from "../../assets/power-outline.svg";
import USBIcon from "../../assets/usb.png";
import AudioIcon from "../../assets/audio.png";
import SituationIcon from "../../assets/situation.png";
import StatusIcon from "../../assets/status.png";
import SettingIcon from "../../assets/setting.png";
import SurveillanceIcon from "../../assets/surveillance.png";
import "./sidebar.scss";

const MenuItem = ({ item }) => {
  return <div style={{ fontSize: 16 }}>{item}</div>;
};

const Sidebar = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const currentPath = window.location.pathname.substring(1);
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
      key: "monitor-mgmt",
      label: (
        <MenuItem
          item=<span className="menu-text">
            {intl.formatMessage(Messages.Text_MonitorManagement_Title)}
          </span>
        />
      ),
      icon: <img src={PowerIcon} alt="singlescreen" className="menu-icon" />,
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
    {
      key: "surveillance",
      label: (
        <MenuItem
          item=<span className="menu-text">
            {intl.formatMessage(Messages.Text_Surveillance_Title)}
          </span>
        />
      ),
      icon: (
        <img src={SurveillanceIcon} alt="surveillance" className="menu-icon" />
      ),
    },
  ];

  const onNavigate = (e) => {
    const path = e.key;
    setSideBarMenuKey(path);
    navigate(`/${path}`);
  };

  return (
    <Menu
      selectedKeys={[sideBarMenuKey]}
      mode="inline"
      items={items}
      style={{
        padding: "16px 8px 0px 8px",
        border: "0 solid white",
        backgroundColor: "#e7e7e7",
      }}
      onClick={onNavigate}
    />
  );
};

export default Sidebar;
