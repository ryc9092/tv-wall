import React, { useContext, useEffect, useRef, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Col, Input, Radio, Row, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import useWindowDimensions from "../utils/WindowDimension";
import { ENCODER_TYPERS } from "../utils/Constant";
import { getDecoders, getEncoders } from "../api/API";
import "../App.scss";
import "./USB.scss";

const USB = () => {
  const { width, height } = useWindowDimensions();
  const [store] = useContext(StoreContext);
  const [encoderType, setEncoderType] = useState("1");
  const [searchFilter, setSearchFilter] = useState("");
  const [decoderElements, setDecoderElements] = useState([]);
  const [encoderElements, setEncoderElements] = useState([]);
  const [choosedDecoderList, setChoosedDecoderList] = useState([]);

  const choosedDecoderListRef = useRef();
  choosedDecoderListRef.current = choosedDecoderList;

  const changeEncoderType = ({ target: { value } }) => {
    setEncoderType(value);
  };

  // Set "decoder list" when search filter is changed
  useEffect(() => {
    (async () => {
      let tempDecoders = [];

      const decoders = await getDecoders(store);
      decoders.forEach((decoder) => {
        if (
          decoder.name.includes(searchFilter) ||
          decoder.nickName.includes(searchFilter)
        )
          tempDecoders.push(decoder);
      });

      let tempDecoderElements = [];
      tempDecoders.forEach((decoder) => {
        tempDecoderElements.push(
          <Row key={decoder.name} style={{ marginTop: "6px" }}>
            <Button
              key={decoder.name}
              id={decoder.name}
              type="text"
              size="small"
              style={{
                cursor: "pointer",
                backgroundColor: choosedDecoderList.includes(decoder.name)
                  ? "#BFE0E4"
                  : null,
              }}
              className="tvwall-encoder"
              onClick={(event) => {
                if (decoder.state === "Up")
                  handleChooseDecoder(event.currentTarget.id);
              }}
            >
              <span
                className={
                  decoder.state === "Up"
                    ? "encoder-normal-dot"
                    : decoder.state === "Down"
                    ? "encoder-down-dot"
                    : "encoder-abnormal-dot"
                }
              />
              {decoder.name}
            </Button>
          </Row>
        );
      });

      setDecoderElements(tempDecoderElements);
    })();
  }, [searchFilter, choosedDecoderList]);

  // Set "encoder list" when search filter is changed
  useEffect(() => {
    (async () => {
      let tempEncoders = [];
      const encoders = await getEncoders(store);
      encoders.forEach((encoder) => {
        tempEncoders.push(encoder);
      });

      let tempEncoderElements = [];
      tempEncoders.forEach((encoder) => {
        tempEncoderElements.push(
          <Row key={encoder.name} style={{ marginTop: "6px" }}>
            <Button
              key={encoder.name}
              id={encoder.name}
              value={encoder.previewUrl}
              type="text"
              size="small"
              style={{ cursor: "pointer" }}
              className="tvwall-encoder"
              onClick={encoder.state === "Up" ? handleChooseEncoder : null}
            >
              <span
                className={
                  encoder.state === "Up"
                    ? "encoder-normal-dot"
                    : encoder.state === "Down"
                    ? "encoder-down-dot"
                    : "encoder-abnormal-dot"
                }
              />
              {encoder.name}
            </Button>
          </Row>
        );
      });

      setEncoderElements(tempEncoderElements);
    })();
  }, []);

  const handleChooseDecoder = (decoderId) => {
    const decoderList = choosedDecoderListRef.current;
    if (decoderList.includes(decoderId)) {
      // remove decoder from list
      setChoosedDecoderList((choosedDecoderList) => {
        return choosedDecoderList.filter((decoder) => decoder !== decoderId);
      });
    } else {
      // add decoder to list
      setChoosedDecoderList((choosedDecoderList) => [
        ...choosedDecoderList,
        decoderId,
      ]);
    }
  };

  const handleChooseEncoder = (e) => {
    console.log(e.currentTarget.id);
  };

  return (
    <div>
      {store.siderCollapse ? (
        <div className="page-title">USB管理</div>
      ) : (
        <div style={{ marginTop: 60 }} />
      )}
      <div
        className="usb-layout container-width"
        style={{ margin: "16px 16px 0px 0px" }}
      >
        <div
          style={{ height: height < "750" ? "50%" : "55%", minHeight: "250px" }}
        >
          <Row style={{ height: "13%" }}>
            <Col>
              <Typography.Text
                style={{ fontSize: "20px", marginRight: "10px" }}
              >
                USB終端
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
          <Row style={{ height: "14%" }}>
            <Radio.Group
              options={ENCODER_TYPERS}
              onChange={changeEncoderType}
              value={encoderType}
              optionType="button"
              buttonStyle="solid"
              style={{ marginTop: 12 }}
            />
          </Row>
          <div className="decoder-block">{decoderElements}</div>
        </div>
        <div
          className="usb-col-layout"
          style={{
            border: "1px solid gray",
            height: "45%",
            minHeight: "220px",
            marginTop: "12px",
          }}
        >
          <div
            style={{
              borderRight: "1px solid gray",
              height: height * 0.39,
            }}
          >
            USB連接狀態
          </div>
          <div>
            <Row>
              <Col span={width > 1060 ? 20 : 17}>USB來源選擇</Col>
              <Col>清除所有連結</Col>
            </Row>
            <div className="encoder-block" style={{ height: height * 0.334 }}>
              {encoderElements}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default USB;
