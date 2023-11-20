import { Button, Menu, Typography } from "antd";
import { useContext } from "react";
import { SIDEBAR_WIDTH } from "../../layouts/responsiveLayout";
import { useNavigate } from "react-router-dom";
import { Actions } from "../store/reducer";
import { StoreContext } from "../store/store";
import Logo from "../../assets/ipec.png";
import "./sidebar.scss";

const bulletPoint = "\u25CF";
const MenuItem = ({ item }) => {
  return (
    <div style={{ fontSize: 16 }}>
      {bulletPoint} {item}
    </div>
  );
};
const items = [
  { key: "equipment-status", label: <MenuItem item={"設備即時狀態"} /> },
  { key: "tv-wall", label: <MenuItem item={"電視牆影音管理"} /> },
  { key: "single-screen", label: <MenuItem item={"單畫面影音管理"} /> },
  { key: "usb", label: <MenuItem item={"USB管理"} /> },
  { key: "rs232", label: <MenuItem item={"RS232管理"} /> },
  { key: "schedule", label: <MenuItem item={"影音排程管理"} /> },
  { key: "situation", label: <MenuItem item={"情境管理"} /> },
  { key: "event", label: <MenuItem item={"事件及告警"} /> },
  { key: "setting", label: <MenuItem item={"系統設定"} /> },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [store, dispatch] = useContext(StoreContext);

  const onLogout = () => {
    dispatch({ type: Actions.Logout, payload: null });
    navigate("/login");
  };

  const onNavigate = (e) => {
    const path = e.key;
    navigate(`/${path}`);
  };

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
          {bulletPoint} {store.account}
          <Button type="text" style={{ fontSize: 16 }} onClick={onLogout}>
            登出
          </Button>
        </Typography.Text>
      </div>
    </div>
  );
};

export default Sidebar;
