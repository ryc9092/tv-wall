import React from "react";
import { Col, Input, Row, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "../App.scss";
import "./TVWall.scss";

const TVWall = () => {
  const encoders = [
    "編碼器1",
    "編碼器2",
    "編碼器3",
    "編碼器4",
    "編碼器5",
    "編碼器6",
    "編碼器7",
    "編碼器8",
  ];

  let encoderElement = [];
  encoders.forEach((encoder) => {
    encoderElement.push(
      <Row key={encoder} style={{ marginTop: "10px" }}>
        <span className="encoder-normal-dot" />
        {encoder}
      </Row>
    );
  });

  const encoderBlock = (
    <div>
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
      <div
        className="tvwall-encoder-layout"
        style={{ borderRight: "1px solid gray" }}
      >
        <div
          style={{
            margin: "15px 5px 0px 15px",
            maxHeight: "29vh",
            overflowY: "auto",
          }}
        >
          {encoderElement}
        </div>
        <div
          style={{
            margin: "15px 5px 0px 15px",
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
      <div className="page-title">電視牆影音管理</div>
      <div
        style={{
          border: "1px solid gray",
          margin: "16px 16px 16px 0px",
        }}
      >
        <Row style={{ borderBottom: "1px solid gray", height: "50vh" }}>
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
