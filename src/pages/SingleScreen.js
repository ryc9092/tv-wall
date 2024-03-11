import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Col, Input, Radio, Row, Switch, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import useWindowDimensions from "../utils/WindowDimension";
import { ENCODER_TYPERS, FAKE_ENCODERS } from "../utils/Constant";
import { getEncoders } from "../api/API";
import { FormattedMessage } from "react-intl";
import Messages from "../messages";
import "../App.scss";
import "./SingleScreen.scss";

const SingleScreen = () => {
  const { height, width } = useWindowDimensions();
  const [store] = useContext(StoreContext);
  const [encoderType, setEncoderType] = useState("1");
  const [searchFilter, setSearchFilter] = useState("");
  const [encoderElementsNormal, setEncoderElementsNormal] = useState([]);
  const [encoderElementsAbnormal, setEncoderElementsAbnormal] = useState([]);
  const [selectedEncoder, setSelectedEncoder] = useState({
    name: "",
    previewUrl: "",
  });
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

  // Set "normal/abnormal encoder list" when search filter is changed
  useEffect(() => {
    (async () => {
      let tempNormalEncoders = [];
      let tempAbnormalEncoders = [];
      const encoders = await getEncoders(store);
      encoders.forEach((encoder) => {
        if (
          encoder.name.includes(searchFilter) ||
          encoder.nickName.includes(searchFilter) ||
          encoder.nickName.includes(searchFilter)
        ) {
          if (encoder.state === "Up") tempNormalEncoders.push(encoder);
          else tempAbnormalEncoders.push(encoder);
        }
      });

      let tempNormalEncoderElements = [];
      tempNormalEncoders.forEach((encoder) => {
        tempNormalEncoderElements.push(
          <Row key={encoder.name} style={{ marginTop: "6px" }}>
            <Button
              key={encoder.name}
              id={encoder.name}
              value={encoder.previewUrl}
              type="text"
              size="small"
              style={{ cursor: "pointer" }}
              className="tvwall-encoder"
              onClick={handleChooseEncoder}
            >
              <span className="encoder-normal-dot" />
              {encoder.nickName}
            </Button>
          </Row>
        );
      });

      let tempAbnormalEncoderElements = [];
      tempAbnormalEncoders.forEach((encoder) => {
        tempAbnormalEncoderElements.push(
          <Row key={encoder.name} style={{ marginTop: "6px" }}>
            <Button
              key={encoder.name}
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
              {encoder.nickName}
            </Button>
          </Row>
        );
      });

      setEncoderElementsNormal(tempNormalEncoderElements);
      setEncoderElementsAbnormal(tempAbnormalEncoderElements);
    })();
  }, [searchFilter]);

  const handleChooseEncoder = (event) => {
    setSelectedEncoder({
      name: event.currentTarget.id,
      previewUrl: event.currentTarget.value,
    });
  };

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
          <Input
            onChange={(e) => {
              setSearchFilter(e.target.value);
            }}
            prefix={<SearchOutlined />}
          />
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
          {encoderElementsNormal}
        </div>
        <div
          style={{
            width: "50%",
            margin: "6px 5px 5px 15px",
            overflowY: "auto",
          }}
        >
          {encoderElementsAbnormal}
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
            {selectedEncoder.previewUrl ? (
              <embed
                style={{ width: "100%", height: "99%" }}
                src={selectedEncoder.previewUrl}
                title="Video player"
              />
            ) : (
              <div
                style={{
                  position: "relative",
                  top: "50%",
                  marginLeft: "62%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <FormattedMessage {...Messages.Text_TVWall_Preview} />
              </div>
            )}
          </div>
        </div>
        <div style={{ margin: "8px 0px 0px 8px", width: "50%" }}>
          <Row style={{ height: "30px" }}>
            <Col>
              <Typography.Text
                style={{ fontSize: "20px", marginRight: "20px" }}
              >
                顯示終端
              </Typography.Text>
            </Col>
            <Col>
              <Input prefix={<SearchOutlined />} />
            </Col>
          </Row>
          <Row
            style={{
              marginTop: "8px",
              overflowY: "auto",
              height: height < "750" ? "92%" : "95%",
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
