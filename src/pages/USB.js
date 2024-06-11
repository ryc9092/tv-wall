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
  Tag,
  Typography,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  createDeviceLink,
  removeDeviceLink,
  getDeviceLinks,
  getDeviceLinkDetails,
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
import PlusIcon from "../assets/plus.png";
import "../App.scss";
import "./USB.scss";

const USB = () => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [decoders, setDecoders] = useState([]);
  const [encoders, setEncoders] = useState([]);
  const [deviceLinks, setDeviceLinks] = useState([]);
  const [linkData, setLinkData] = useState([]);

  const [encoderType, setEncoderType] = useState("1");
  const [decoderDict, setDecoderDict] = useState({}); // { $mac: { nickName: $nickName, mac: $mac... } }
  const [encoderDict, setEncoderDict] = useState({});
  const [searchFilter, setSearchFilter] = useState("");
  const [decoderElements, setDecoderElements] = useState([]);
  const [encoderElements, setEncoderElements] = useState([]);
  const [choosedDecoderList, setChoosedDecoderList] = useState([]);
  const [choosedDecoderElements, setChoosedDecoderElements] = useState(null);
  const [choosedEncoder, setChoosedEncoder] = useState(null);

  useEffect(() => {
    (async () => {
      const encoders = await getEncoders(store);
      const decoders = await getDecoders(store);
      const deviceLinks = await getDeviceLinks({
        store: store,
        linkType: "usb",
        isPreset: "N",
      });
      setDecoders(decoders);
      setEncoders(encoders);
      setDeviceLinks(deviceLinks);
      console.log(deviceLinks);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let tempLinkData = [];
      await deviceLinks.forEach(async (deviceLink) => {
        let encoderName;
        encoders.some((encoder) => {
          if (encoder.mac === deviceLink.encoder) {
            encoderName = encoder.nickName;
            return true;
          } else return false;
        });
        let linkDetail = await getDeviceLinkDetails({
          store: store,
          linkId: deviceLink.id,
        });
        linkDetail.forEach((link) => {
          console.log("dddd", link.decoder);
          decoders.some((decoder) => {
            if (decoder.mac === link.decoder) {
              tempLinkData.push({
                encoderMac: deviceLink.encoder,
                encoderName: encoderName,
                decoderMac: link.decoder,
                decoderName: decoder.nickName,
              });
              console.log(tempLinkData);
              return true;
            } else return false;
          });
        });
      });
      console.log("-----");
      // setLinkData(tempLinkData);
    })();
  }, [deviceLinks]);

  useEffect(() => {
    console.log(linkData, "lfsdjfdsfh");
  }, [linkData]);

  const columns = [
    {
      title: (
        <span className="usb-content-table-head">
          {intl.formatMessage(Messages.Text_USB_Source)}
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
        <span className="usb-content-table-head">
          {intl.formatMessage(Messages.Text_Common_Model)}
        </span>
      ),
      dataIndex: "decoderName",
      key: "decoderName",
      // render: (text) => {
      //   return <span style={{ fontSize: "16px" }}>{text}</span>;
      // },
    },
    {
      title: (
        <span style={{ fontSize: "16px", fontFamily: "PingFangTC" }}>
          {intl.formatMessage(Messages.Text_DeviceStatus_State)}
        </span>
      ),
      key: "state",
      dataIndex: "state",
      sorter: (a, b) => a.state.length - b.state.length,
      render: (_, { state, name }) => <></>,
    },
  ];

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
            linkId: `usb.` + choosedEncoder,
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

  const handleCancel = () => {
    setChoosedDecoderList([]);
    setChoosedEncoder();
  };

  const handleClearConnection = async () => {
    if (choosedEncoder) {
      const result = await removeDeviceLink({
        store: store,
        linkId: `usb.` + choosedEncoder,
      });
      if (result) {
        setChoosedDecoderList([]);
        setChoosedEncoder();
        showSuccessNotificationByMsg(
          intl.formatMessage(Messages.Text_USB_ClearConnectionSuccess)
        );
      } else {
        showWarningNotification(
          intl.formatMessage(Messages.Text_USB_ClearConnectionFail)
        );
      }
    }
  };

  const handleCreateConnection = async () => {
    if (choosedDecoderList.length > 0 && choosedEncoder) {
      const result = await createDeviceLink({
        store: store,
        id: `usb.` + choosedEncoder,
        linkType: "usb",
        encoder: choosedEncoder,
        decoders: choosedDecoderList,
        remark: "",
        isPreset: "N",
      });
      if (result) {
        showSuccessNotificationByMsg(
          intl.formatMessage(Messages.Text_USB_CreateConnectionSuccess)
        );
      } else {
        showWarningNotification(
          intl.formatMessage(Messages.Text_USB_CreateConnectionFail)
        );
      }
    }
  };

  return (
    <div
      className={
        store.siderCollapse
          ? `page-layout-column-collapse`
          : `page-layout-column`
      }
    >
      <div>
        <div className="usb-title-row">
          <span className="page-title">
            <FormattedMessage {...Messages.Text_USB_USBMgmt} />
          </span>
          <Input
            className="usb-title-input usb-input"
            variant="filled"
            onChange={(e) => {
              setSearchFilter(e.target.value);
            }}
            prefix={<SearchOutlined />}
            placeholder={intl.formatMessage(Messages.Text_USB_InputUSBSource)}
          />
        </div>
        <div className="usb-content-container">
          <div className="usb-content-title-row">
            <span className="usb-content-title">
              <FormattedMessage {...Messages.Text_USB_ConnectionStatus} />
            </span>
            <Button shape="circle" className="usb-content-create-button">
              <img
                alt="create"
                src={PlusIcon}
                className="usb-content-create-button-icon"
              />
            </Button>
          </div>
          <div className="usb-content-table-row ">
            <span className="usb-content-table-head">
              <FormattedMessage {...Messages.Text_USB_Source} />
            </span>
            <span className="usb-content-table-head">
              <FormattedMessage {...Messages.Text_USB_Destination} />
            </span>
            <span className="usb-content-table-head">
              <FormattedMessage {...Messages.Text_USB_Status} />
            </span>
            <span className="usb-content-table-head">
              <FormattedMessage {...Messages.Text_USB_Operation} />
            </span>
          </div>
          <Divider style={{ marginTop: 8 }} />
          <Table
            columns={columns}
            dataSource={linkData}
            pagination={false}
            size={"small"}
            onRow={(record) => ({
              onClick: () => {
                handleChooseEncoder(record);
              },
            })}
          />
          {/* <div
            style={{
              height: height < "750" ? "50%" : "55%",
              minHeight: "250px",
            }}
          >
            <Row style={{ height: "13%" }}>
              <Col>
                <Typography.Text
                  style={{ fontSize: "20px", marginRight: "10px" }}
                >
                  <FormattedMessage {...Messages.Text_USB_Source} />
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
              <Row>
                <FormattedMessage {...Messages.Text_USB_ConnectionStatus} />
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
                  <Row style={{ marginLeft: 14 }}>
                    <FormattedMessage {...Messages.Text_USB_Connect} />
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
                  <FormattedMessage {...Messages.Text_USB_TerminalChoose} />
                </Col>
                <Col>
                  <Button size="small" onClick={handleClearConnection}>
                    <FormattedMessage {...Messages.Text_USB_ClearConnection} />
                  </Button>
                </Col>
              </Row>
              <Row>
                <div
                  className="encoder-block"
                  style={{ height: height * 0.26 }}
                >
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default USB;
