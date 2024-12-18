import { useContext, useState } from "react";
import { StoreContext } from "../components/store/store";
import TVWallSetting from "../components/setting/tvWall/tvWallSetting";
import TemplateSetting from "../components/setting/template/templateSetting";
import DeviceSetting from "../components/setting/device/deviceSetting";
import { FormattedMessage } from "react-intl";
import Messages from "../messages";
import "../App.scss";
import "./Setting.scss";

const Setting = () => {
  const [store] = useContext(StoreContext);
  const [page, setPage] = useState("device");

  const pageContent = {
    tvwall: <TVWallSetting />,
    template: <TemplateSetting />,
    device: <DeviceSetting />,
  };

  return (
    <div>
      <div
        className={
          store.siderCollapse ? `setting-topbar-collapse` : `setting-topbar`
        }
      >
        <div className="setting-topbar-title">
          <FormattedMessage {...Messages.Text_SystemSetting_Title} />
        </div>
        <div className="setting-topbar-line" />
        {/* <div
          className="setting-topbar-option"
          onClick={() => {
            setPage("tvwall");
          }}
        >
          <FormattedMessage {...Messages.Text_WallSetting_WallSetting} />
        </div>
        <div
          className="setting-topbar-option"
          onClick={() => {
            setPage("template");
          }}
        >
          <FormattedMessage
            {...Messages.Text_TemplateSetting_TemplateSetting}
          />
        </div> */}
        <div
          className="setting-topbar-option"
          onClick={() => {
            setPage("device");
          }}
        >
          <FormattedMessage {...Messages.Text_DeviceSetting_AdvanceSetting} />
        </div>
        {/* <div
          className="setting-topbar-option"
          onClick={() => {
            // setPage("devicesetting");
          }}
        >
          <FormattedMessage {...Messages.Text_DeviceSetting_AdvanceSetting} />
        </div> */}
      </div>
      <div
        className={
          store.siderCollapse
            ? `page-layout-column-collapse`
            : `page-layout-column`
        }
      >
        {pageContent[page]}
      </div>
    </div>
  );
};

export default Setting;
