import { Button, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import SettingTemplateModal from "../components/setting/template/templateModal";
import SettingWallModal from "../components/setting/tvWall/wallModal";
import SettingDeviceModal from "../components/setting/device/deviceModal";
import { FormattedMessage } from "react-intl";
import Messages from "../messages";
import "../App.scss";
import "./Setting.scss";

const Setting = () => {
  const options = [
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
        <FormattedMessage {...Messages.Text_SystemSetting_Title} />
      </div>
      <SettingTemplateModal />
      <SettingWallModal />
      <SettingDeviceModal />
      {/* {optionsObject} */}
    </div>
  );
};

export default Setting;
