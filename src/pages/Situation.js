import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "antd";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import CreateSituationModal from "../components/situation/createSituation";
import SituationContentModal from "../components/situation/situationContent"
import "../App.scss";
import "./Situation.scss";

const Situation = () => {
  const intl = useIntl();
  const [situations, setSituations] = useState([])
  const [reload, setReload] = useState(null)

  // get situations on reload
  useEffect(()=>{
    // todo: get situations by api
    console.log("reload")
  },[reload])

  return (
    <div>
      <div className="page-title">
        <FormattedMessage {...Messages.Text_Situation_Title} />
      </div>
      <div style={{marginTop: 18}}>
        {/* <Button className="create-situation-button">create new situation</Button> */}
        <CreateSituationModal setReload={setReload}/>
      </div>
      <div style={{ marginTop: 68 }}>
        <Card className="situation-card" >
          <Row>
            <Col>
              <Row>
                情境名稱
              </Row>
              <Row style={{marginLeft: 54, marginTop: 16}}>
                情境描述xxxxxxxxxxxxxxxxxxx
              </Row>
            </Col>
            <Col offset={9}>
              <div>
                <Button>delete</Button>
              </div>
              <div  style={{marginTop: 12}}>
                {/* <Button>edit</Button> */}
                <SituationContentModal />
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default Situation;
