import React, { useContext, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Col, Input, Radio, Row, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ENCODER_TYPERS, FAKE_ENCODERS } from "../utils/EncoderConstant";
import "../App.scss";
import "./TVWall.scss";

const TVWall = () => {
  const [store] = useContext(StoreContext);
  const [encoderType, setEncoderType] = useState("1");

  const changeEncoderType = ({ target: { value } }) => {
    setEncoderType(value);
  };

  let encoderElement = [];
  FAKE_ENCODERS.forEach((encoder) => {
    encoderElement.push(
      <Row key={encoder} style={{ marginTop: "10px" }}>
        <span className="encoder-normal-dot" />
        {encoder}
      </Row>
    );
  });

  const encoderBlock = (
    <div style={{ borderRight: "1px solid gray" }}>
      <Row style={{ margin: "8px 0px 0px 8px" }}>
        <Col>
          <Typography.Text style={{ fontSize: "20px", marginRight: "10px" }}>
            影像來源
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
          style={{ margin: "10px 0px 0px 8px" }}
        />
      </Row>
      <div className="tvwall-encoder-layout">
        <div
          style={{
            margin: "5px 5px 0px 15px",
            height: "29vh",
            overflowY: "auto",
          }}
        >
          {encoderElement}
        </div>
        <div
          style={{
            margin: "5px 5px 0px 15px",
            maxHeight: "29vh",
            overflowY: "auto",
          }}
        >
          {encoderElement}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {store.siderCollapse ? (
        <div className="page-title">電視牆影音管理</div>
      ) : (
        <div style={{ marginTop: 60 }} />
      )}
      <div
        style={{
          border: "1px solid gray",
          margin: "16px 16px 16px 0px",
        }}
      >
        <Row style={{ borderBottom: "1px solid gray", height: "45vh" }}>
          top
        </Row>
        <Row>
          <div className="tvwall-video-layout">
            {encoderBlock}
            <div>
              <video controls width="100%" height="100%">
                <source src={""} type="video/mp4" />
                Sorry, your browser doesn't support embedded videos.
              </video>
            </div>
          </div>
        </Row>
      </div>
    </div>
  );
};

export default TVWall;
