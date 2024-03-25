import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import CreateSituationModal from "../components/situation/createSituation";
import SituationContentModal from "../components/situation/situationContent";
import "../App.scss";
import "./Situation.scss";

const Situation = () => {
  const intl = useIntl();
  const [situations, setSituations] = useState([]);
  const [reload, setReload] = useState(null);

  // get situations on reload
  useEffect(() => {
    // todo: get situations by api
    console.log("reload");
  }, [reload]);

  return (
    <div>
      <div className="page-title">
        <FormattedMessage {...Messages.Text_Situation_Title} />
      </div>
      <div style={{ marginTop: 18 }}>
        <CreateSituationModal setReload={setReload} />
      </div>
      <div style={{ marginTop: 68 }}>
        <Card
          title="情境名稱"
          className="situation-card"
          extra={
            <Button type="text">
              <DeleteOutlined />
            </Button>
          }
        >
          <div style={{ marginLeft: 54, marginTop: 0 }}>
            <SituationContentModal desc={"情境描述xxxxxxxxxxxxxxxxxxx"} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Situation;
