import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Card, Col, Input, Row, Tabs, Tag, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import useWindowDimensions from "../utils/WindowDimension";
import {
  createDeviceLink,
  removeDeviceLink,
  getDeviceLinks,
  getDecoders,
  getEncoders,
} from "../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import TrashIcon from "../assets/trash.png";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
} from "../utils/Utils";
import "../App.scss";
import "./SingleScreen.scss";

const SingleScreen = () => {
  const intl = useIntl();
  const { height, width } = useWindowDimensions();
  const [store] = useContext(StoreContext);
  const [tab, setTab] = useState("single-screen");
  const [decoders, setDecoders] = useState([]);
  const [searchDecoderFilter, setSearchDecoderFilter] = useState("");
  const [filteredDecoders, setFilteredDecoders] = useState([]);
  const [decoderCards, setDecoderCards] = useState(null);
  const [encoders, setEncoders] = useState([]);
  const [searchEncoderFilter, setSearchEncoderFilter] = useState("");
  const [filteredEncoders, setFilteredEncoders] = useState([]);
  const [selectedEncoder, setSelectedEncoder] = useState({
    name: "",
    previewUrl: "",
  });
  const [currentScreen, setCurrentScreen] = useState(null);
  const [reload, setReload] = useState(null);

  const handleScreenMouseEnter = (event) => {
    const itemId = event.target.id;
    setCurrentScreen(itemId);
  };

  const handleScreenMouseLeave = () => {
    setCurrentScreen(null);
  };

  const tabItems = [
    {
      key: "single-screen",
      label: intl.formatMessage(Messages.Text_SingleScreen_TabSingleScreen),
      onClick: () => {
        setTab("single-screen");
      },
    },
  ];

  // set encoder, decoder
  useEffect(() => {
    (async () => {
      const encoders = await getEncoders(store);
      const decoders = await getDecoders(store);
      const deviceLinks = await getDeviceLinks({
        store: store,
        linkType: "video",
        isPreset: "N",
      });

      let linkedDecoders = [];
      deviceLinks.forEach((deviceLink) => {
        const decoderMac = deviceLink.id.split(".")[1];
        linkedDecoders.push(decoderMac);
      });

      let tempDecoders = []; // for set decoders
      decoders.forEach((decoder) => {
        if (linkedDecoders.includes(decoder.mac)) {
          deviceLinks.forEach((deviceLink) => {
            const encoderMac = deviceLink.encoder;
            const decoderMac = deviceLink.id.split(".")[1];
            encoders.forEach((encoder) => {
              if (encoder.mac === encoderMac && decoder.mac === decoderMac) {
                tempDecoders.push({
                  ...decoder,
                  previewUrl: encoder.previewUrl,
                  encoder: {
                    mac: encoder.mac,
                    nickName: encoder.nickName,
                  },
                });
              }
            });
          });
        } else {
          tempDecoders.push({
            ...decoder,
            previewUrl: "",
            encoder: {
              mac: "",
              nickName: "",
            },
          });
        }
      });
      setEncoders(encoders);
      setDecoders(tempDecoders.length > 0 ? tempDecoders : decoders);
    })();
  }, [reload]);

  // filtered encoder list
  useEffect(() => {
    (async () => {
      let tempFilteredEncoders = [];
      encoders.forEach((encoder) => {
        if (encoder.nickName.includes(searchEncoderFilter))
          tempFilteredEncoders.push({ key: encoder.mac, ...encoder });
      });
      setFilteredEncoders(tempFilteredEncoders);
    })();
  }, [encoders, searchEncoderFilter]);

  const handleChooseEncoder = (encoder) => {
    setSelectedEncoder({
      mac: encoder.mac,
      previewUrl: encoder.previewUrl,
      nickName: encoder.nickName,
    });
  };

  // filtered decoder list
  useEffect(() => {
    (async () => {
      let tempFilteredDecoders = [];
      decoders.forEach((decoder) => {
        if (decoder.nickName.includes(searchDecoderFilter))
          tempFilteredDecoders.push(decoder);
      });
      setFilteredDecoders(tempFilteredDecoders);
    })();
  }, [decoders, searchDecoderFilter]);

  const modifyVideoSize = (previewUrl, width, height) => {
    const hostname = previewUrl.split("?")[0];
    const modifiedUrl = `${hostname}?action=stream&w=${width}&h=${height}&fps=15&bw=5000&as=0`;
    return modifiedUrl;
  };

  const onScreenClick = (event) => {
    if (!event.target.id.includes("btn") && selectedEncoder.previewUrl) {
      let tempDecoders = [];
      const decoderMac = event.target.id.split("-")[1];
      decoders.forEach((decoder) => {
        if (decoder.mac === decoderMac) {
          tempDecoders.push({
            ...decoder,
            previewUrl: selectedEncoder.previewUrl,
            encoder: {
              mac: selectedEncoder.mac,
              nickName: selectedEncoder.nickName,
            },
          });
        } else {
          tempDecoders.push(decoder);
        }
      });
      setDecoders(tempDecoders);
    }
  };

  const handleClearScreen = async (event) => {
    const decoderMac = event.target.id.split("-")[1];
    let tempDecoders = decoders;
    let clearedLink = false;
    tempDecoders.forEach(async (decoder) => {
      if (
        decoder.mac === decoderMac &&
        decoder.encoder !== "" &&
        clearedLink === false
      ) {
        clearedLink = true;
        const result = await removeDeviceLink({
          store: store,
          linkId: `video.` + decoder.mac,
        });
        if (result) {
          showSuccessNotificationByMsg(
            intl.formatMessage(Messages.Text_SingleScreen_VideoClearSuccess)
          );
        } else {
          showWarningNotification(
            intl.formatMessage(Messages.Text_SingleScreen_VideoClearFail)
          );
        }
      }
    });
    setDecoders(tempDecoders);
    setReload(Math.random());
  };

  const handleLinkScreen = (event) => {
    const decoderMac = event.target.id.split("-")[1];
    let tempDecoders = decoders;
    let createdLink = false;
    tempDecoders.forEach(async (decoder) => {
      if (
        decoder.mac === decoderMac &&
        decoder.encoder &&
        decoder.encoder.mac !== "" &&
        createdLink === false
      ) {
        createdLink = true;
        const result = await createDeviceLink({
          store: store,
          id: `video.${decoder.mac}`,
          linkType: "video",
          encoder: decoder.encoder.mac,
          decoders: [decoder.mac],
          value1: "video",
          remark: "",
          isPreset: "N",
        });
        if (result) {
          showSuccessNotificationByMsg(
            intl.formatMessage(Messages.Text_SingleScreen_VideoPlaySuccess)
          );
        } else {
          showWarningNotification(
            intl.formatMessage(Messages.Text_SingleScreen_VideoPlayFail)
          );
        }
      }
    });
  };

  useEffect(() => {
    let tempDecoderCards = [];
    filteredDecoders.forEach((decoder) => {
      tempDecoderCards.push(
        <Col
          key={`col-${decoder.mac}`}
          id={`card-${decoder.mac}`}
          onMouseOver={handleScreenMouseEnter}
          onMouseLeave={handleScreenMouseLeave}
        >
          {/* <Col
          span={6}
          key={`col-${decoder.mac}`}
          id={`card-${decoder.mac}`}
          onMouseOver={handleScreenMouseEnter}
          onMouseLeave={handleScreenMouseLeave}
        > */}
          <div
            className="single-screen-card"
            style={{
              backgroundColor:
                currentScreen && currentScreen.includes(decoder.mac)
                  ? "gray"
                  : "white",
            }}
            onClick={onScreenClick}
          >
            {decoder.previewUrl ? (
              <iframe
                className="single-screen-card-video"
                style={{
                  width:
                    document.getElementById(`card-${decoder.mac}`)
                      ?.clientWidth - 10,
                  height:
                    document.getElementById(`card-${decoder.mac}`)
                      ?.clientHeight - 11,
                  border: 0,
                }}
                src={modifyVideoSize(
                  decoder.previewUrl,
                  document.getElementById(`card-${decoder.mac}`)?.clientWidth -
                    10,
                  document.getElementById(`card-${decoder.mac}`)?.clientHeight -
                    11
                )}
                // src={decoder.previewUrl}
                title="Video player"
              />
            ) : null}
            <div
              id={`card-${decoder.mac}`}
              className="single-screen-card"
              style={{
                width: `${
                  document.getElementById(`card-${decoder.mac}`)?.clientWidth -
                  10
                }px`,
                height: `${
                  document.getElementById(`card-${decoder.mac}`)?.clientHeight -
                  11
                }px`,
                position: "absolute",
                zIndex: 100,
                opacity: 0.8,
                backgroundColor:
                  currentScreen && currentScreen.includes(decoder.mac)
                    ? "gray"
                    : null,
              }}
            >
              <div
                id={`card-${decoder.mac}`}
                className="single-screen-card-title-row"
              >
                <span
                  id={`card-${decoder.mac}`}
                  className="single-screen-card-title"
                  style={{
                    color:
                      currentScreen && currentScreen.includes(decoder.mac)
                        ? "white"
                        : "#45413e",
                  }}
                >
                  {decoder.nickName}
                </span>
                <span id={`card-${decoder.mac}`} style={{ marginTop: "2px" }}>
                  {decoder.state === "Up" ? (
                    <Tag
                      id={`card-${decoder.mac}`}
                      color={"#eef9b4"}
                      key={`${decoder.name}.${decoder.state}`}
                    >
                      <span
                        id={`card-${decoder.mac}`}
                        style={{ color: "#a0b628" }}
                      >
                        <FormattedMessage {...Messages.Text_Common_Up} />
                      </span>
                    </Tag>
                  ) : decoder.state === "Down" ? (
                    <Tag
                      id={`card-${decoder.mac}`}
                      color={"#ffe6e5"}
                      key={`${decoder.name}.${decoder.state}`}
                    >
                      <span
                        id={`card-${decoder.mac}`}
                        style={{ color: "#d55959" }}
                      >
                        <FormattedMessage {...Messages.Text_Common_Down} />
                      </span>
                    </Tag>
                  ) : (
                    <Tag
                      id={`card-${decoder.mac}`}
                      color={"yellow"}
                      key={`${decoder.name}.${decoder.state}`}
                    >
                      {decoder.state}
                    </Tag>
                  )}
                </span>
              </div>
              {currentScreen && currentScreen.includes(decoder.mac) ? (
                <div id={`card-${decoder.mac}`}>
                  <div
                    id={`card-${decoder.mac}`}
                    className="single-screen-card-desc"
                  >
                    <FormattedMessage {...Messages.Text_TVWall_VideoSource} />
                    {" : "}{" "}
                    {decoder.previewUrl
                      ? decoder.encoder?.nickName
                      : intl.formatMessage(Messages.Text_Common_None)}
                  </div>
                  <div
                    id={`card-${decoder.mac}`}
                    style={{ marginTop: 100, marginLeft: 160 }}
                  >
                    <Button
                      id={`btn-${decoder.mac}`}
                      type="primary"
                      shape="circle"
                      style={{ background: "black", position: "absolute" }}
                      onClick={(event) => handleClearScreen(event)}
                    >
                      <img
                        id={`btn-${decoder.mac}`}
                        alt="trash"
                        src={TrashIcon}
                        style={{ width: 18, height: 18, marginTop: 2 }}
                      />
                    </Button>
                    <Button
                      id={`btn-${decoder.mac}`}
                      type="primary"
                      style={{
                        width: "80px",
                        color: "black",
                        backgroundColor: "#ebdd2d",
                        position: "absolute",
                        marginLeft: 42,
                        marginBottom: 2,
                      }}
                      onClick={(event) => handleLinkScreen(event)}
                    >
                      <span
                        id={`btn-${decoder.mac}`}
                        className="single-screen-btn-text"
                      >
                        <FormattedMessage
                          {...Messages.Text_SingleScreen_PlayVideo}
                        />
                      </span>
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </Col>
      );
    });
    setDecoderCards(tempDecoderCards);
  }, [filteredDecoders, currentScreen]);

  const columns = [
    {
      title: intl.formatMessage(Messages.Text_Common_Name),
      dataIndex: "nickName",
      key: "nickName",
      render: (text) => {
        return (
          <span
            style={
              selectedEncoder.nickName === text
                ? { backgroundColor: "#FDEBD0" }
                : null
            }
          >
            {text}
          </span>
        );
      },
    },
    {
      title: intl.formatMessage(Messages.Text_Common_Model),
      dataIndex: "model",
      key: "model",
      filters: [
        {
          text: "ZyperUHD60",
          value: "ZyperUHD60",
        },
        {
          text: "Zyper4k",
          value: "Zyper4k",
        },
      ],
      onFilter: (value, data) => data.model.indexOf(value) === 0,
    },
    {
      title: intl.formatMessage(Messages.Text_DeviceStatus_State),
      key: "state",
      dataIndex: "state",
      sorter: (a, b) => a.state.length - b.state.length,
      render: (_, { state, name }) => (
        <>
          {state === "Up" ? (
            <Tag color={"#eef9b4"} key={`${name}.${state}`}>
              <span style={{ color: "#a0b628" }}>
                <FormattedMessage {...Messages.Text_Common_Up} />
              </span>
            </Tag>
          ) : state === "Down" ? (
            <Tag color={"#ffe6e5"} key={`${name}.${state}`}>
              <span style={{ color: "#d55959" }}>
                <FormattedMessage {...Messages.Text_Common_Down} />
              </span>
            </Tag>
          ) : (
            <Tag color={"yellow"} key={`${name}.${state}`}>
              {state}
            </Tag>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="page-layout-column">
      <div className="single-screen-container">
        <div className="single-screen-title-row">
          <span className="page-title">
            <FormattedMessage {...Messages.Text_SingleScreen_Management} />
          </span>
          <Input
            className="single-screen-title-input singlescreen-input"
            variant="filled"
            onChange={(e) => {
              setSearchDecoderFilter(e.target.value);
            }}
            prefix={<SearchOutlined />}
            placeholder={intl.formatMessage(
              Messages.Text_SingleScreen_InputDecoder
            )}
          />
        </div>
        <div className="single-screen-title-row" style={{ marginTop: "16px" }}>
          <Tabs defaultActiveKey="1" items={tabItems} />
          {/* <div>clear</div> */}
        </div>
        <div>
          <Row gutter={10}>{tab === "single-screen" ? decoderCards : null}</Row>
        </div>
      </div>
      <div
        className="tvwall-card-container"
        style={{ minHeight: `${height - 104}px` }} // deduct topbar & padding
      >
        {/* <div
        className="singlescreen-card-container"
        style={{ height: "fit-content" }} // for connection type
      > */}
        <Card className="singlescreen-card-right">
          <div className="singlescreen-card-right-title">
            <FormattedMessage {...Messages.Text_TVWall_VideoSource} />
          </div>
          <div className="singlescreen-card-right-desc">
            <FormattedMessage {...Messages.Text_TVWall_VideoSourceDesc} />
          </div>
          <div className="singlescreen-card-right-preview">
            {selectedEncoder.previewUrl ? (
              <div>
                <iframe
                  className="singlescreen-card-right-preview-video"
                  src={selectedEncoder.previewUrl}
                  title="Video player"
                />
                <span>{selectedEncoder.nickName}</span>
              </div>
            ) : (
              <div className="singlescreen-card-right-preview-text singlescreen-card-right-desc">
                <FormattedMessage {...Messages.Text_TVWall_Preview} />
              </div>
            )}
          </div>
          <Input
            className="singlescreen-card-right-search singlescreen-input"
            variant="filled"
            onChange={(e) => {
              setSearchEncoderFilter(e.target.value);
            }}
            prefix={<SearchOutlined />}
            placeholder={intl.formatMessage(Messages.Text_TVWall_InputEncoder)}
          />
          <div className="singlescreen-card-right-encoder-container">
            <Table
              columns={columns}
              dataSource={filteredEncoders}
              pagination={false}
              size={"small"}
              onRow={(record) => ({
                onClick: () => {
                  handleChooseEncoder(record);
                },
              })}
              style={{ maxHeight: `${height - 510}px`, marginBottom: 0 }}
            />
          </div>
          {/* <div className="singlescreen-card-right-bottom">
            <div className="singlescreen-card-right-bottom-text">
              <FormattedMessage {...Messages.Text_SingleScreen_ConnectType} />
            </div>
            <Select className="singlescreen-card-right-bottom-select" />
          </div> */}
        </Card>
      </div>
    </div>
  );
};

export default SingleScreen;
