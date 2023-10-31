import { Button, Menu, Typography } from "antd";
import { useContext } from "react";
import { SIDEBAR_WIDTH } from "../../layouts/responsiveLayout";
import { useNavigate } from "react-router-dom";
import { Actions } from "../store/reducer";
import { StoreContext } from "../store/store";
import Logo from "../../assets/ipec.png";

const bulletPoint = "\u25CF";
const items = [
  { key: "1", label: `${bulletPoint} 設備即時狀態` },
  { key: "2", label: `${bulletPoint} 電視牆影音管理` },
  { key: "3", label: `${bulletPoint} 單畫面影音管理` },
  { key: "4", label: `${bulletPoint} USB管理` },
  { key: "5", label: `${bulletPoint} RS232管理` },
  { key: "6", label: `${bulletPoint} 影音排程管理` },
  { key: "7", label: `${bulletPoint} 情境管理` },
  { key: "8", label: `${bulletPoint} 事件及告警` },
  { key: "9", label: `${bulletPoint} 系統設定` },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [store, dispatch] = useContext(StoreContext);

  const onLogout = () => {
    dispatch({ type: Actions.Logout, payload: null });
    navigate("/login");
  };

  return (
    <div style={{ width: SIDEBAR_WIDTH }}>
      <div style={{ top: 6, left: 6, position: "absolute" }}>
        <img src={Logo} style={{ cursor: "pointer" }} alt="IPEC" width={100} />
      </div>
      <div style={{ marginTop: 120, marginLeft: -15 }}>
        <Menu
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          style={{ border: "0 solid white" }}
        />
      </div>
      <div
        style={{
          position: store.siderCollapse ? "relative" : "absolute",
          bottom: 16,
          left: 14,
        }}
      >
        {bulletPoint}
        <Typography.Text style={{ fontSize: 16 }}>
          {" "}
          {store.account}
          <Button type="text" style={{ fontSize: 16 }} onClick={onLogout}>
            登出
          </Button>
        </Typography.Text>
      </div>
    </div>
  );
};

export default Sidebar;
