import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Col, Input, Radio, Row, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import TvWall from "../components/tvwall/tvWall";
import TVWallTemplate from "../components/tvwall/tvWallTemplate";
import useWindowDimensions from "../utils/WindowDimension";
import { ENCODER_TYPERS, FAKE_ENCODERS } from "../utils/Constant";
import "../App.scss";
import "./TVWall.scss";

const TVWall = () => {
  const { width } = useWindowDimensions();
  const [store] = useContext(StoreContext);
  const [encoderType, setEncoderType] = useState("1");
  const [isSmallElement, setIsSmallElement] = useState(false);

  // The elements size would be changed according to width
  useEffect(() => {
    if (width > 824 && isSmallElement) setIsSmallElement(false);
    else if (width < 824 && !isSmallElement) setIsSmallElement(true);
  }, [isSmallElement, width]);

  const changeEncoderType = ({ target: { value } }) => {
    setEncoderType(value);
  };

  const handleChooseEncoder = (event) => {
    console.log(event.target.id);
  };

  let encoderElement = [];
  FAKE_ENCODERS.forEach((encoder) => {
    encoderElement.push(
      <Row key={encoder} style={{ marginTop: "10px" }}>
        <div
          id={encoder}
          style={{ cursor: "pointer" }}
          className="tvwall-encoder"
          onClick={handleChooseEncoder}
        >
          <span className="encoder-normal-dot" />
          {encoder}
        </div>
      </Row>
    );
  });

  const encoderBlock = (
    <div
      style={{ borderRight: "1px solid gray", width: "60%", minWidth: "345px" }}
    >
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
      <div
        className="tvwall-encoder-layout"
        style={{ margin: "8px 0px 0px 15px" }}
      >
        <div style={{ overflowY: "auto", width: "89%" }}>{encoderElement}</div>
        <div style={{ overflowY: "auto", width: "89%" }}>{encoderElement}</div>
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
      <div className="container-border container-height container-width">
        <div style={{ borderBottom: "1px solid gray", height: "50%" }}>
          {/* <TVWallTemplate /> */}
          <TvWall />
        </div>
        <div style={{ height: "50%" }} className="tvwall-video-layout ">
          {encoderBlock}
          <div style={{ width: "40%" }}>
            <video controls style={{ width: "100%", height: "100%" }}>
              <source src={""} type="video/mp4" />
              Sorry, your browser doesn't support embedded videos.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVWall;
