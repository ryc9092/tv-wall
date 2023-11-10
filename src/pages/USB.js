import React, { useContext, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Col, Input, Radio, Row, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ENCODER_TYPERS, FAKE_ENCODERS } from "../utils/EncoderConstant";
import "../App.scss";
import "./USB.scss";

const USB = () => {
  const [store] = useContext(StoreContext);
  const [encoderType, setEncoderType] = useState("1");

  let encoderElement = [];
  FAKE_ENCODERS.forEach((encoder) => {
    encoderElement.push(
      <div key={encoder} style={{ marginTop: "10px" }}>
        <span className="encoder-normal-dot" />
        {encoder}
      </div>
    );
  });

  const changeEncoderType = ({ target: { value } }) => {
    setEncoderType(value);
  };

  return (
    <div>
      {store.siderCollapse ? (
        <div className="page-title">USB管理</div>
      ) : (
        <div style={{ marginTop: 60 }} />
      )}
      <div className="usb-row-layout" style={{ margin: "16px 16px 16px 0px" }}>
        <div style={{ height: "47vh" }}>
          <Row>
            <Col>
              <Typography.Text
                style={{ fontSize: "20px", marginRight: "10px" }}
              >
                USB終端
              </Typography.Text>
            </Col>
            <Col>
              <Input prefix={<SearchOutlined />} />
            </Col>
          </Row>
          <Row>
            <Radio.Group
              options={ENCODER_TYPERS}
              onChange={changeEncoderType}
              value={encoderType}
              optionType="button"
              buttonStyle="solid"
              style={{ marginTop: 12 }}
            />
          </Row>
          <div className="encoder-block">{encoderElement}</div>
        </div>
        <div
          className="usb-col-layout"
          style={{ border: "1px solid gray", height: "40vh" }}
        >
          <div style={{ borderRight: "1px solid gray" }}>USB連接狀態</div>
          <div>USB來源選擇</div>
        </div>
      </div>
    </div>
  );
};

export default USB;
