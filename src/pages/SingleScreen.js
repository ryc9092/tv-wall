import React, { useContext } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Col, Input, Row, Switch, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "../App.scss";
import "./SingleScreen.scss";

const SingleScreen = () => {
  const [store] = useContext(StoreContext);

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
      <div className="single-screen-col-layout">
        <div
          style={{
            margin: "15px 5px 5px 15px",
            height: "38vh",
            overflowY: "auto",
          }}
        >
          {encoderElement}
        </div>
        <div
          style={{
            margin: "15px 5px 5px 15px",
            height: "38vh",
            overflowY: "auto",
          }}
        >
          {encoderElement}
        </div>
      </div>
    </div>
  );

  let encoderScreen = [];
  encoders.forEach((encoder) => {
    encoderScreen.push(
      <div
        key={`${encoder}-screen`}
        style={{
          margin: "12px 6px 0px 0px",
          width: store.siderCollapse ? "21.5vw" : "18vw",
          textAlign: "center",
        }}
      >
        <div
          key={`${encoder}-screen`}
          style={{
            height: "28vh",
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
      <div
        className="single-screen-col-layout"
        style={{
          border: "1px solid gray",
          margin: "16px 16px 16px 0px",
        }}
      >
        <div
          className="single-screen-row-layout"
          style={{ borderRight: "1px solid gray" }}
        >
          <div style={{ borderBottom: "1px solid gray", height: "47vh" }}>
            {encoderBlock}
          </div>
          <div style={{ height: "40vh" }}>
            <video controls width="100%" height="100%">
              <source src={""} type="video/mp4" />
              Sorry, your browser doesn't support embedded videos.
            </video>
          </div>
        </div>
        <div style={{ margin: "8px 0px 0px 8px", height: "18vh" }}>
          <Row>
            <Typography.Text style={{ fontSize: "20px", marginRight: "20px" }}>
              顯示終端
            </Typography.Text>
            <Typography.Text style={{ fontSize: "20px" }}>
              區域名稱
            </Typography.Text>
          </Row>
          <Row style={{ marginTop: "10px" }}>
            <Button style={{ width: "87px", marginRight: "6px" }}>群組</Button>
            <Button style={{ width: "87px" }}>單顯示器</Button>
          </Row>
          <Row style={{ width: "180px", marginTop: "10px" }}>
            <Input prefix={<SearchOutlined />} />
          </Row>
          <Row style={{ overflowY: "auto", height: "68vh" }}>
            {encoderScreen}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default SingleScreen;
