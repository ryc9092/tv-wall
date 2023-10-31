import React from "react";
import { Col, Row } from "antd";
import "../App.scss";

const TVWall = () => {
  return (
    <div>
      <div className="page-title">電視牆影音管理</div>
      <div
        style={{
          border: "1px solid gray",
          minHeight: "87vh",
          margin: "16px 16px 16px 0px",
        }}
      >
        <Row style={{ borderBottom: "1px solid gray", minHeight: "50vh" }}>
          top
        </Row>
        <Row style={{ minHeight: "37vh" }}>
          <Col span={15} style={{ borderRight: "1px solid gray" }}>
            left
          </Col>
          <Col span={9}>right</Col>
        </Row>
      </div>
    </div>
  );
};

export default TVWall;
