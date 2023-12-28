import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Col, Input, Radio, Row, Select, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import TvWall from "../components/tvwall/tvWall";
import useWindowDimensions from "../utils/WindowDimension";
import { ENCODER_TYPERS } from "../utils/Constant";
import { getWalls, getTemplates, getEncoders } from "../api/API";
import "../App.scss";
import "./TVWall.scss";

const TVWall = () => {
  const { width } = useWindowDimensions();
  const [store] = useContext(StoreContext);
  const [encoderType, setEncoderType] = useState("1");
  const [isSmallElement, setIsSmallElement] = useState(false);
  const [wallOptions, setWallOptions] = useState([]);
  const [encoderElementsNormal, setEncoderElementsNormal] = useState([]);
  const [encoderElementsAbnormal, setEncoderElementsAbnormal] = useState([]);

  // The elements size would be changed according to width
  useEffect(() => {
    if (width > 824 && isSmallElement) setIsSmallElement(false);
    else if (width < 824 && !isSmallElement) setIsSmallElement(true);
  }, [isSmallElement, width]);

  // Set wall options and normal/abnormal encoder list
  useEffect(() => {
    (async () => {
      let tempWallOptions = [];
      const result = await getWalls();
      result.forEach((wall) => {
        tempWallOptions.push({ value: wall.name, label: wall.name });
      });
      setWallOptions(tempWallOptions);
    })();

    (async () => {
      let tempNormalEncoders = [];
      let tempAbnormalEncoders = [];
      const encoders = await getEncoders(store);
      encoders.forEach((encoder) => {
        if (encoder.state === "Up") tempNormalEncoders.push(encoder);
        else tempAbnormalEncoders.push(encoder);
      });

      let tempNormalEncoderElements = [];
      tempNormalEncoders.forEach((encoder) => {
        tempNormalEncoderElements.push(
          <Row key={encoder.name} style={{ marginTop: "6px" }}>
            <Button
              id={encoder.name}
              type="text"
              size="small"
              style={{ cursor: "pointer" }}
              className="tvwall-encoder"
              onClick={handleChooseEncoder}
            >
              <span className="encoder-normal-dot" />
              {encoder.name}
            </Button>
          </Row>
        );
      });

      let tempAbnormalEncoderElements = [];
      tempAbnormalEncoders.forEach((encoder) => {
        tempAbnormalEncoderElements.push(
          <Row key={encoder.name} style={{ marginTop: "6px" }}>
            <Button
              id={encoder.name}
              type="text"
              size="small"
              style={{ cursor: "pointer" }}
            >
              <span
                className={
                  encoder.state === "Down"
                    ? "encoder-down-dot"
                    : "encoder-abnormal-dot"
                }
              />
              {encoder.name}
            </Button>
          </Row>
        );
      });

      setEncoderElementsNormal(tempNormalEncoderElements);
      setEncoderElementsAbnormal(tempAbnormalEncoderElements);
    })();
  }, []);

  const changeEncoderType = ({ target: { value } }) => {
    setEncoderType(value);
  };

  const handleChooseEncoder = (event) => {
    console.log(event.currentTarget.id);
  };

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
        <div style={{ overflowY: "scroll", width: "89%" }}>
          {encoderElementsNormal}
        </div>
        <div style={{ overflowY: "scroll", width: "89%" }}>
          {encoderElementsAbnormal}
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
      <div className="container-border container-height container-width">
        <div style={{ borderBottom: "1px solid gray", height: "50%" }}>
          <Row>
            <Col style={{ width: 270, margin: 8 }}>
              <Row>
                <Select
                  defaultValue={wallOptions[0]?.value}
                  options={wallOptions}
                  style={{ minWidth: 120 }}
                ></Select>
                <Button style={{ marginLeft: 12, color: "#f5222d" }}>
                  清除牆面連接
                </Button>
              </Row>
              <Row style={{ marginTop: 8 }}>
                <Button>版型1</Button>
              </Row>
              <Row style={{ marginTop: 8 }}>
                <Button>版型2</Button>
              </Row>
              <Row style={{ marginTop: 8 }}>
                <Button>版型3</Button>
              </Row>
            </Col>
            <Col style={{ margin: 8 }}>
              <TvWall />
            </Col>
          </Row>
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
