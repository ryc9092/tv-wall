import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Col, Input, Radio, Row, Switch, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import useWindowDimensions from "../utils/WindowDimension";
import { ENCODER_TYPERS, FAKE_ENCODERS } from "../utils/EncoderConstant";
import "../App.scss";
import "./SingleScreen.scss";

const SingleScreen = () => {
  const { height, width } = useWindowDimensions();
  const [store] = useContext(StoreContext);
  const [encoderType, setEncoderType] = useState("1");
  const [isSmallElement, setIsSmallElement] = useState(false);

  // The elements size would be changed according to width
  useEffect(() => {
    if (width > 960 && isSmallElement) setIsSmallElement(false);
    else if (width < 960 && !isSmallElement) setIsSmallElement(true);
  }, [isSmallElement, width]);

  let encoderElement = [];
  FAKE_ENCODERS.forEach((encoder) => {
    encoderElement.push(
      <Row key={encoder} style={{ marginTop: "10px" }}>
        <span className="encoder-normal-dot" />
        {encoder}
      </Row>
    );
  });

  const changeEncoderType = ({ target: { value } }) => {
    setEncoderType(value);
  };

  const encoderBlock = (
    <div style={{ borderBottom: "1px solid gray", height: "60%" }}>
      <Row style={{ margin: "8px 0px 0px 8px", height: "11%" }}>
        <Col>
          <Typography.Text style={{ fontSize: "20px", marginRight: "10px" }}>
            影像來源
          </Typography.Text>
        </Col>
        <Col>
          <Input prefix={<SearchOutlined />} />
        </Col>
      </Row>
      <Row style={{ height: "15%" }}>
        <Radio.Group
          options={ENCODER_TYPERS}
          onChange={changeEncoderType}
          value={encoderType}
          optionType="button"
          buttonStyle="solid"
          style={{ margin: "10px 0px 0px 8px" }}
          size={isSmallElement ? "small" : "middle"}
        />
      </Row>
      <div className="single-screen-layout" style={{ height: "74%" }}>
        <div
          style={{
            width: "50%",
            margin: "6px 5px 5px 15px",
            overflowY: "auto",
          }}
        >
          {encoderElement}
        </div>
        <div
          style={{
            width: "50%",
            margin: "6px 5px 5px 15px",
            overflowY: "auto",
          }}
        >
          {encoderElement}
        </div>
      </div>
    </div>
  );

  let encoderScreen = [];
  FAKE_ENCODERS.forEach((encoder) => {
    encoderScreen.push(
      <div
        key={`${encoder}-screen`}
        style={{
          margin: "12px 6px 0px 0px",
          height: "48%",
          width: "48%",
          textAlign: "center",
        }}
      >
        <div
          key={`${encoder}-screen`}
          style={{
            height: "82%",
            border: "1px solid gray",
            marginBottom: "2px",
          }}
        >
          {encoder}
        </div>
        <span style={{ textAlign: "center" }}>
          <Typography.Text style={{ fontSize: "14px", marginRight: "6px" }}>
            {encoder}
          </Typography.Text>
          <Switch style={{ marginTop: "-2px" }} />
        </span>
      </div>
    );
  });

  return (
    <div>
      {store.siderCollapse ? (
        <div className="page-title">單畫面影音管理</div>
      ) : (
        <div style={{ marginTop: 60 }} />
      )}
      <div className="container-border container-height container-width single-screen-layout">
        <div style={{ borderRight: "1px solid gray", width: "50%" }}>
          {encoderBlock}
          <div style={{ height: "39%" }}>
            <video controls width="100%" height="100%">
              <source src={""} type="video/mp4" />
              Sorry, your browser doesn't support embedded videos.
            </video>
          </div>
        </div>
        <div style={{ margin: "8px 0px 0px 8px", width: "50%" }}>
          <div style={{ height: height < "750" ? "25%" : "20%" }}>
            <Row style={{ height: "30%" }}>
              <Typography.Text
                style={{ fontSize: "20px", marginRight: "20px" }}
              >
                顯示終端
              </Typography.Text>
              <Typography.Text style={{ fontSize: "20px" }}>
                區域名稱
              </Typography.Text>
            </Row>
            <Row style={{ marginTop: "10px", height: "30%" }}>
              <Button style={{ width: "87px", marginRight: "6px" }}>
                群組
              </Button>
              <Button style={{ width: "87px" }}>單顯示器</Button>
            </Row>
            <Row style={{ width: "180px", marginTop: "10px" }}>
              <Input prefix={<SearchOutlined />} />
            </Row>
          </div>
          <Row
            style={{
              marginTop: "8px",
              overflowY: "auto",
              height: height < "750" ? "72%" : "78%",
            }}
          >
            {encoderScreen}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default SingleScreen;
