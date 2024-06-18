import React, { useContext, useEffect, useRef, useState } from "react";
import { StoreContext } from "../components/store/store";
import {
  Button,
  Col,
  Divider,
  Input,
  Radio,
  Row,
  Table,
  Typography,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import useWindowDimensions from "../utils/WindowDimension";
import { ENCODER_TYPERS } from "../utils/Constant";
import {
  getDeviceLinks,
  createDeviceLink,
  removeDeviceLink,
  getDeviceLinkDetails,
  getDeviceLinkByEncoder,
  getDecoders,
  getEncoders,
} from "../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import PlusIcon from "../assets/plus.png";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
} from "../utils/Utils";
import "../App.scss";
import "./Audio.scss";

const Audio = () => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [pageType, setPageType] = useState("CONN_STATE"); // CONN_STATE, ADD_LINK, EDIT_LINK
  const [decoders, setDecoders] = useState([]);
  const [encoders, setEncoders] = useState([]);
  const [deviceLinks, setDeviceLinks] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [linkData, setLinkData] = useState([]);
  const [reload, setReload] = useState(null);

  const [selectedEncoder, setSelectedEncoder] = useState([]);
  const [encoderFilter, setEncoderFilter] = useState("");
  const [filteredEncoders, setFilteredEncoders] = useState([]);

  const [selectedDecoders, setSelectedDecoders] = useState([]);
  const [decoderFilter, setDecoderFilter] = useState("");
  const [filteredDecoders, setFilteredDecoders] = useState([]);

  const [encoderType, setEncoderType] = useState("1");
  const [decoderDict, setDecoderDict] = useState({});
  const [encoderDict, setEncoderDict] = useState({});
  const [decoderElements, setDecoderElements] = useState([]);
  const [encoderElements, setEncoderElements] = useState([]);
  const [choosedDecoderList, setChoosedDecoderList] = useState([]);
  const [choosedDecoderElements, setChoosedDecoderElements] = useState(null);
  const [choosedEncoder, setChoosedEncoder] = useState(null);
  const [chooseAudioType, setChooseAudioType] = useState("analogAudio");

  useEffect(() => {
    (async () => {
      const encoders = await getEncoders(store);
      const decoders = await getDecoders(store);
      const deviceLinks = await getDeviceLinks({
        store: store,
        linkType: "audio",
        isPreset: "N",
      });
      encoders.forEach((encoder) => {
        encoder.key = encoder.mac;
      });
      decoders.forEach((decoder) => {
        decoder.key = decoder.mac;
      });
      setDecoders(decoders);
      setFilteredDecoders(decoders);
      setEncoders(encoders);
      setFilteredEncoders(encoders);
      setDeviceLinks(deviceLinks);
      setLinkData([]);
    })();
  }, [reload]);

  useEffect(() => {
    setLinkData([]);
    let tempLinkData = [];
    deviceLinks.forEach(async (deviceLink, index) => {
      let encoderName;
      encoders.some((encoder) => {
        if (
          encoder.mac === deviceLink.encoder &&
          encoder.nickName.includes(searchFilter)
        ) {
          encoderName = encoder.nickName;
          return true;
        } else return false;
      });
      let linkDetail = await getDeviceLinkDetails({
        store: store,
        linkId: deviceLink.id,
      });
      linkDetail.forEach((link) => {
        decoders.some((decoder) => {
          if (encoderName && decoder.mac === link.decoder) {
            tempLinkData.push({
              key: `${deviceLink.encoder}.${link.decoder}`,
              encoderMac: deviceLink.encoder,
              encoderName: encoderName,
              decoderMac: link.decoder,
              decoderName: decoder.nickName,
            });
            return true;
          } else return false;
        });
      });
      if (index + 1 === deviceLinks.length) setLinkData(tempLinkData);
    });
  }, [deviceLinks, searchFilter]);

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

          let tempDecoderList = [];
          if (result) {
            result.forEach((detail) => {
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

  const handleCancel = () => {
    setChoosedDecoderList([]);
    setChoosedEncoder();
  };

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

  const columns = [
    {
      title: (
        <span className="audio-content-table-head">
          {intl.formatMessage(Messages.Text_Common_Encoder)}
        </span>
      ),
      dataIndex: "encoderName",
      key: "encoderName",
      render: (text) => {
        return <span>{text}</span>;
      },
    },
    {
      title: (
        <span className="audio-content-table-head">
          {intl.formatMessage(Messages.Text_Audio_Input)}
        </span>
      ),
      dataIndex: "encoderName",
      key: "encoderName",
      render: (text) => {
        return <span>{text}</span>;
      },
    },
    {
      title: (
        <span className="audio-content-table-head">
          {intl.formatMessage(Messages.Text_Common_Decoder)}
        </span>
      ),
      dataIndex: "decoderName",
      key: "decoderName",
      render: (text) => {
        return <span style={{ fontSize: "16px" }}>{text}</span>;
      },
    },
    {
      title: (
        <span className="audio-content-table-head">
          {intl.formatMessage(Messages.Text_Audio_Output)}
        </span>
      ),
      dataIndex: "encoderName",
      key: "encoderName",
      render: (text) => {
        return <span>{text}</span>;
      },
    },
  ];

  return (
    <div
      className={
        store.siderCollapse
          ? `page-layout-column-collapse`
          : `page-layout-column`
      }
    >
      <div>
        <div className="audio-title-row">
          <span className="page-title">
            <FormattedMessage {...Messages.Text_Audio_AudioMgmt} />
          </span>
          {pageType === "CONN_STATE" ? (
            <Input
              className="audio-title-input audio-input"
              variant="filled"
              onChange={(e) => {
                setSearchFilter(e.target.value);
              }}
              prefix={<SearchOutlined />}
              placeholder={intl.formatMessage(
                Messages.Text_Audio_InputAudioMsg
              )}
            />
          ) : null}
        </div>
        {pageType === "CONN_STATE" ? (
          <div className="audio-content-container">
            <div className="audio-content-title-row">
              <span className="audio-content-title">
                <FormattedMessage {...Messages.Text_USB_ConnectionStatus} />
              </span>
              <Button
                shape="circle"
                className="audio-content-create-button"
                onClick={() => {
                  setPageType("ADD_LINK");
                  setSelectedEncoder(null);
                  setSelectedDecoders([]);
                  setReload(Math.random());
                }}
              >
                <img
                  alt="create"
                  src={PlusIcon}
                  className="audio-content-create-button-icon"
                />
              </Button>
            </div>
            <Table columns={columns} dataSource={linkData} />
          </div>
        ) : null}
      </div>

      {/* <div
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
                <Radio.Button value="analogAudio">
                  {choosedEncoder && encoderDict[choosedEncoder].audioAnalogy
                    ? encoderDict[choosedEncoder].audioAnalogy
                    : "analog"}
                </Radio.Button>
                <Radio.Button value="hdmiAudio">
                  {choosedEncoder && encoderDict[choosedEncoder].audioHdmi
                    ? encoderDict[choosedEncoder].audioHdmi
                    : "hdmi"}
                </Radio.Button>
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
                <Button onClick={handleCancel}>
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
      </div> */}
    </div>
  );
};

export default Audio;
