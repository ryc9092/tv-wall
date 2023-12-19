import { Button, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import TvWallSettingModal from "../components/systemSetting/tvWallSettingModal";
import CreateTvWall from "../components/modals/createTvWall";
import CreateTvWallTemplate from "../components/modals/createTvWallTemplate";
import "../App.scss";
import "./Setting.scss";

const Setting = () => {
  const options = [
    { title: "設備進階設定" },
    { title: "電視牆設定" },
    { title: "顯示器群組設定" },
    { title: "RS232設定" },
    { title: "帳號&權限設定" },
  ];

  let optionsObject = [];
  options.forEach((option) => {
    optionsObject.push(
      <Button key={option.title} className="setting-option-button">
        <Typography.Text className="setting-option-text">
          {option.title}
        </Typography.Text>
        <></>
        <EditOutlined className="setting-option-icon" />
      </Button>
    );
  });

  return (
    <div>
      <div className="page-title" style={{ margin: " 24px 0px 48px 0px" }}>
        系統設定
      </div>
      {optionsObject}
      <TvWallSettingModal />
      <CreateTvWall />
      <CreateTvWallTemplate />
    </div>
  );
};

export default Setting;
