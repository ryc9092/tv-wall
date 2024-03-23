import React, { useContext, useEffect, useRef, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Col, Divider, Input, Radio, Row, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import useWindowDimensions from "../utils/WindowDimension";
import { ENCODER_TYPERS } from "../utils/Constant";
import {
  createDeviceLink,
  removeDeviceLink,
  getDeviceLinkByEncoder,
  getDecoders,
  getEncoders,
} from "../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
} from "../utils/Utils";
import "../App.scss";
import "./Audio.scss";

const Audio = () => {
  const intl = useIntl();
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
  const [chooseAudioType, setChooseAudioType] = useState("analogAudio");

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
          let result = await getDeviceLinkByEncoder({
            store: store,
            linkId: `${chooseAudioType}.` + choosedEncoder,
          });
          // todo: api wrong format, change to real result
          result = {
            details: [
              {
                key: "analogAudio.0:1c:d5:1:2f:91_0:1c:d5:1:11:b5",
                linkId: "analogAudio.0:1c:d5:1:2f:91",
                decoder: "0:1c:d5:1:11:b5",
                value1: "",
                value2: "",
                value3: "",
                value4: "",
              },
              {
                key: "analogAudio.0:1c:d5:1:2f:91_0:1c:d5:1:12:d",
                linkId: "analogAudio.0:1c:d5:1:2f:91",
                decoder: "0:1c:d5:1:12:d",
                value1: "",
                value2: "",
                value3: "",
                value4: "",
              },
              {
                key: "analogAudio.0:1c:d5:1:2f:91_0:1c:d5:1:11:5a",
                linkId: "analogAudio.0:1c:d5:1:2f:91",
                decoder: "0:1c:d5:1:11:5a",
                value1: "",
                value2: "",
                value3: "",
                value4: "",
              },
              {
                key: "analogAudio.0:1c:d5:1:2f:91_0:1c:d5:1:11:e8",
                linkId: "analogAudio.0:1c:d5:1:2f:91",
                decoder: "0:1c:d5:1:11:e8",
                value1: "",
                value2: "",
                value3: "",
                value4: "",
              },
            ],
          };
          let tempDecoderList = [];
          if (result?.details) {
            result.details.forEach((detail) => {
              tempDecoderList.push(detail.decoder);
            });
          }
          setChoosedDecoderList(tempDecoderList);
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
  }, [choosedEncoder, encoderDict, searchFilter, chooseAudioType]);

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

  const handleClearConnection = async () => {
    if (choosedEncoder) {
      const result = await removeDeviceLink({
        store: store,
        linkId: `${chooseAudioType}.` + choosedEncoder,
      });
      if (result) {
        setChoosedDecoderList([]);
        setChoosedEncoder();
        showSuccessNotificationByMsg(
          intl.formatMessage(Messages.Text_Audio_ClearConnectionSuccess)
        );
      } else {
        showWarningNotification(
          intl.formatMessage(Messages.Text_Audio_ClearConnectionFail)
        );
      }
    }
  };

  const handleCreateConnection = async () => {
    console.log(choosedDecoderList, choosedEncoder);
    if (choosedDecoderList.length > 0 && choosedEncoder) {
      const result = await createDeviceLink({
        store: store,
        id: `${chooseAudioType}.` + choosedEncoder,
        linkType: chooseAudioType,
        encoder: choosedEncoder,
        decoders: choosedDecoderList,
        value1: chooseAudioType,
        remark: "",
        isPreset: "N",
      });
      if (result) {
        showSuccessNotificationByMsg(
          intl.formatMessage(Messages.Text_Audio_CreateConnectionSuccess)
        );
      } else {
        showWarningNotification(
          intl.formatMessage(Messages.Text_Audio_CreateConnectionFail)
        );
      }
    }
  };

  const handleChooseAudioType = (e) => {
    const audioType = e.target.value;
    setChooseAudioType(audioType);
  };

  return (
    <div>
      {store.siderCollapse ? (
        <div className="page-title">
          <FormattedMessage {...Messages.Text_Audio_AudioMgmt} />
        </div>
      ) : (
        <div style={{ marginTop: 60 }} />
      )}
      <div
        className="audio-layout container-width"
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
                <FormattedMessage {...Messages.Text_Audio_Source} />
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
          className="audio-col-layout"
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
            <Row>
              <span style={{ marginLeft: 2, marginTop: 3 }}>
                <FormattedMessage {...Messages.Text_Audio_ConnectionStatus} />
              </span>
              <Radio.Group
                defaultValue="analogAudio"
                size="small"
                buttonStyle="solid"
                style={{ marginLeft: 6, marginTop: 1 }}
                onChange={handleChooseAudioType}
              >
                <Radio.Button value="analogAudio">analog</Radio.Button>
                <Radio.Button value="hdmiAudio">hdmi</Radio.Button>
              </Radio.Group>
            </Row>
            <Row style={{ marginTop: 24, marginLeft: 6 }}>
              <Col span={8}>
                <Row>
                  <FormattedMessage {...Messages.Text_Common_Encoder} />
                </Row>
                <Row style={{ marginTop: 6 }}>
                  {encoderDict[choosedEncoder]?.nickName}
                </Row>
              </Col>
              <Col span={8}>
                <Row style={{ marginLeft: 10 }}>
                  {chooseAudioType === "analogAudio" ? (
                    <FormattedMessage {...Messages.Text_Audio_AnalogConnect} />
                  ) : (
                    <FormattedMessage {...Messages.Text_Audio_HdmiConnect} />
                  )}
                </Row>
                <Row>{"<------------>"}</Row>
              </Col>
              <Col span={8}>
                <Row>
                  <FormattedMessage {...Messages.Text_Common_Decoder} />
                </Row>
                {choosedDecoderElements}
              </Col>
            </Row>
          </div>
          <div>
            <Row>
              <Col span={width > 1060 ? 19 : 16}>
                <FormattedMessage {...Messages.Text_Audio_TerminalChoose} />
              </Col>
              <Col>
                <Button size="small" onClick={handleClearConnection}>
                  <FormattedMessage {...Messages.Text_Audio_ClearConnection} />
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
                <Button onClick={handleClearConnection}>
                  <FormattedMessage {...Messages.Text_Button_Cancel} />
                </Button>
              </Col>
              <Col offset={14}>
                <Button onClick={handleCreateConnection}>
                  <FormattedMessage {...Messages.Text_Button_Save} />
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audio;
