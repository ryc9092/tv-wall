import React, { useContext, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Col, Input, Radio, Row, Switch, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "../App.scss";
import "./USB.scss";

const USB = () => {
  const [store] = useContext(StoreContext);
  const [encoderType, setEncoderType] = useState("1");

  const options = [
    {
      label: "ZyperUHD60",
      value: "1",
    },
    {
      label: "Zyper4k",
      value: "2",
    },
    {
      label: "Zyper4k-XS",
      value: "3",
      disabled: true,
    },
    {
      label: "Zyper4k-XR",
      value: "4",
      disabled: true,
    },
  ];

  const encoders = [
    "編碼器1",
    "編碼器2",
    "編碼器3",
    "編碼器4",
    "編碼器5",
    "編碼器6",
    "編碼器7",
    "編碼器8",
    "編碼器61",
    "編碼器71",
    "編碼器81",
    "編碼器22",
    "編碼器32",
    "編碼器42",
    "編碼器52",
    "編碼器62",
    "編碼器72",
    "編碼器82",
    "編碼器612",
    "編碼器712",
    "編碼器812",
    "編碼器8124",
    "編碼器23",
    "編碼器33",
    "編碼器43",
    "編碼器53",
    "編碼器63",
    "編碼器73",
    "編碼器83",
    "編碼器613",
    "編碼器713",
    "編碼器813",
  ];

  let encoderElement = [];
  encoders.forEach((encoder) => {
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
              options={options}
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
