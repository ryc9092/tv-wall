import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store";
import { Button, Modal, Row, Select, Table, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../../messages";
import PlusIcon from "../../../assets/plus-white.png";
import "./tvWallSetting.scss";
import "../../../App.scss";

const TVWallSetting = () => {
  return (
    <div className="content-container">
      <div className="title-row">
        <div className="page-title">
          <FormattedMessage {...Messages.Text_WallSetting_WallSetting} />
        </div>
        <div>
          <Button className="create-wall-btn" onClick={() => {}}>
            <img alt="create" src={PlusIcon} className="create-wall-btn-icon" />
            <span className="create-wall-btn-text">
              <FormattedMessage {...Messages.Text_WallSetting_CreateWall} />
            </span>
          </Button>
        </div>
      </div>
      <div>
        wall content
        <Table />
      </div>
    </div>
  );
};

export default TVWallSetting;
