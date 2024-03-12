import React, { useContext, useEffect, useRef, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Col, Divider, Input, Radio, Row, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import useWindowDimensions from "../utils/WindowDimension";
import { ENCODER_TYPERS } from "../utils/Constant";
import {
  createDeviceLink,
  getDeviceLinkByEncoderType,
  getDecoders,
  getEncoders,
} from "../api/API";
import "../App.scss";
import "./USB.scss";

const USB = () => {
  const { width, height } = useWindowDimensions();
  const [store] = useContext(StoreContext);
  const [encoderType, setEncoderType] = useState("1");
  const [decoderDict, setDecoderDict] = useState({});
  const [encoderDict, setEncoderDict] = useState({});
  const [searchFilter, setSearchFilter] = useState("");
  const [decoderElements, setDecoderElements] = useState([]);
  const [encoderElements, setEncoderElements] = useState([]);
  const [choosedDecoderList, setChoosedDecoderList] = useState([]);
  const [choosedDecoderElements, setChoosedDecoderElements] = useState(null);
  const [choosedEncoder, setChoosedEncoder] = useState(null);

  const choosedDecoderListRef = useRef();
  choosedDecoderListRef.current = choosedDecoderList;

  const changeEncoderType = ({ target: { value } }) => {
    setEncoderType(value);
  };

  const setDeviceState = (devices, setState) => {
    let tempDeviceDict = {};
    devices.forEach((device) => {
      tempDeviceDict[device.mac] = device;
    });
    setState(tempDeviceDict);
  };

  // set devices dict state
  useEffect(() => {
    (async () => {
      const decoders = await getDecoders(store);
      setDeviceState(decoders, setDecoderDict);
      const encoders = await getEncoders(store);
      setDeviceState(encoders, setEncoderDict);
    })();
  }, []);

  // Set "decoder list" when search filter is changed
  useEffect(() => {
    let tempDecoderElements = [];
    for (const [, decoder] of Object.entries(decoderDict)) {
      tempDecoderElements.push(
        <Row key={decoder.mac}>
          <Button
            key={decoder.mac}
            id={decoder.mac}
            nickname={decoder.nickName}
            type="text"
            size="small"
            style={{
              cursor: "pointer",
              backgroundColor: choosedDecoderList.includes(decoder.mac)
                ? "#BFE0E4"
                : null,
            }}
            className="tvwall-encoder"
            onClick={(event) => {
              if (decoder.state === "Up") {
                const mac = event.currentTarget.id;
                const nickName = event.currentTarget.nickname;
                handleChooseDecoder(mac, nickName);
              }
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
            {decoder.nickName}
          </Button>
        </Row>
      );
    }
    setDecoderElements(tempDecoderElements);
  }, [searchFilter, choosedDecoderList, decoderDict]);

  // Set "encoder list" when search filter is changed
  useEffect(() => {
    let filterEncoders = [];
    for (const [, encoder] of Object.entries(encoderDict)) {
      if (
        encoder.mac.includes(searchFilter) ||
        encoder.nickName.includes(searchFilter)
      )
        filterEncoders.push(encoder);
    }

    let tempEncoderElements = [];
    filterEncoders.forEach((encoder) => {
      // get link of clicked encoders
      if (choosedEncoder === encoder.mac) {
        (async () => {
          const result = await getDeviceLinkByEncoderType({
            store: store,
            linkType: "usb",
            encoder: choosedEncoder,
          });
          setChoosedDecoderList(["0:1c:d5:1:11:b5", "0:1c:d5:1:12:d"]); // TODO: change to real result
          console.log(result);
        })();
      }

      // display encoders & change background of encoder if clicked
      tempEncoderElements.push(
        <Row key={encoder.mac} style={{ marginTop: "6px" }}>
          <Button
            key={encoder.mac}
            id={encoder.mac}
            value={encoder.previewUrl}
            type="text"
            size="small"
            style={{
              cursor: "pointer",
              backgroundColor:
                choosedEncoder === encoder.mac ? "#BFE0E4" : null,
            }}
            className="tvwall-encoder"
            onClick={(event) => {
              const encoderName = event.currentTarget.id;
              if (encoder.state === "Up") handleChooseEncoder(encoderName);
            }}
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
            {encoder.nickName}
          </Button>
        </Row>
      );
    });
    setEncoderElements(tempEncoderElements);
  }, [choosedEncoder, encoderDict, searchFilter]);

  const handleChooseDecoder = (decoderMac, decoderNickName) => {
    const decoderList = choosedDecoderListRef.current;
    if (decoderList.includes(decoderMac)) {
      // remove decoder from list
      setChoosedDecoderList((choosedDecoderList) => {
        return choosedDecoderList.filter((decoder) => decoder !== decoderMac);
      });
    } else {
      // add decoder to list
      setChoosedDecoderList((choosedDecoderList) => [
        ...choosedDecoderList,
        decoderMac,
      ]);
    }
  };

  const handleChooseEncoder = (encoderName) => {
    setChoosedEncoder(encoderName);
  };

  useEffect(() => {
    let tempChoosedDecoderElements = [];
    choosedDecoderList.forEach((decoder) => {
      tempChoosedDecoderElements.push(
        <Row key={decoder} style={{ marginTop: "6px" }}>
          <span key={decoder}>{decoderDict[decoder].nickName}</span>
        </Row>
      );
    });
    setChoosedDecoderElements(tempChoosedDecoderElements);
  }, [choosedDecoderList]);

  const handleClearConnection = () => {
    setChoosedDecoderList([]);
    setChoosedEncoder();
  };

  const handleCreateConnection = async () => {
    console.log(choosedDecoderList, choosedEncoder);
    if (choosedDecoderList.length > 0 && choosedEncoder) {
      const result = await createDeviceLink({
        store: store,
        id: choosedEncoder,
        linkType: "usb",
        encoder: choosedEncoder,
        decoders: choosedDecoderList,
        remark: "",
      });
      console.log(result, "!!!");
    }
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
          <div className="decoder-block">{encoderElements}</div>
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
            <Row>USB連接狀態</Row>
            <Row style={{ marginTop: 24, marginLeft: 6 }}>
              <Col span={8}>
                <Row>編碼器</Row>
                <Row style={{ marginTop: 6 }}>{choosedEncoder}</Row>
              </Col>
              <Col span={8}>
                <Row style={{ marginLeft: 14 }}>USB連接</Row>
                <Row>{"<------------>"}</Row>
              </Col>
              <Col span={8}>
                <Row>解碼器</Row>
                {choosedDecoderElements}
              </Col>
            </Row>
          </div>
          <div>
            <Row>
              <Col span={width > 1060 ? 19 : 16}>USB來源選擇</Col>
              <Col>
                <Button size="small" onClick={handleClearConnection}>
                  清除連結
                </Button>
              </Col>
            </Row>
            <Row>
              <div className="encoder-block" style={{ height: height * 0.26 }}>
                {decoderElements}
              </div>
            </Row>
            <Divider
              style={{
                marginTop: -12,
                marginBottom: 10,
              }}
            />
            <Row>
              <Col offset={2}>
                <Button onClick={handleClearConnection}>cancel</Button>
              </Col>
              <Col offset={14}>
                <Button onClick={handleCreateConnection}>Submit</Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default USB;
