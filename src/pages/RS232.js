import React, { useContext, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Col, Input, Radio, Row, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ENCODER_TYPERS, FAKE_ENCODERS } from "../utils/EncoderConstant";
import "../App.scss";
import "./RS232.scss";

const RS232 = () => {
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
        <div className="page-title">RS232管理</div>
      ) : (
        <div style={{ marginTop: 60 }} />
      )}
      <div
        className="rs232-row-layout"
        style={{ margin: "16px 16px 16px 0px" }}
      >
        <div style={{ height: "47vh" }}>
          <Row>
            <Col>
              <Typography.Text
                style={{ fontSize: "20px", marginRight: "10px" }}
              >
                RS232終端
              </Typography.Text>
            </Col>
            <Col>
              <Input prefix={<SearchOutlined />} />
            </Col>
          </Row>
          <Row style={{ marginTop: 12 }}>
            <Col style={{ marginRight: 12 }}>
              <Button>連接管理主機</Button>
            </Col>
            <Col style={{ marginRight: 16 }}>
              <Button>編解碼連結</Button>
            </Col>
            <Col>
              <Radio.Group
                options={ENCODER_TYPERS}
                onChange={changeEncoderType}
                value={encoderType}
                optionType="button"
                buttonStyle="solid"
              />
            </Col>
          </Row>
          <div className="encoder-block">{encoderElement}</div>
          {/* <Row> // TODO: ask the way to display encoder type button
            <Col style={{ margin: "2% 2% 1% 0%" }}>
              <Row>
                <button>ZyperUHD60</button>
              </Row>
              <Row>
                <button>Zyper4k</button>
              </Row>
            </Col>
            <Col style={{ width: "89%" }}>
              <div className="encoder-block">{encoderElement}</div>
            </Col>
          </Row> */}
        </div>
        <div
          className="rs232-col-layout"
          style={{ border: "1px solid gray", height: "40vh" }}
        >
          <div style={{ borderRight: "1px solid gray" }}>RS232既有連接狀態</div>
          <div>RS232來源端選擇</div>
        </div>
      </div>
    </div>
  );
};

export default RS232;
