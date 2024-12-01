import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Card, Col, Input, Row, Tag, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  createDeviceLink,
  removeDeviceLink,
  getDeviceLinks,
  getFilteredDecoders,
  getEncoders,
} from "../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import TrashIcon from "../assets/trash.png";
import XIcon from "../assets/X.png";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
} from "../utils/Utils";
import "../App.scss";
import "./SingleScreen.scss";

const SingleScreen = () => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [decoders, setDecoders] = useState([]);
  const [originDecoders, setOriginDecoders] = useState([]);
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
  const [updateDecoderCards, setUpdateDecoderCards] = useState(null);

  const handleScreenMouseEnter = (event) => {
    const itemId = event.target.id;
    setCurrentScreen(itemId);
  };

  const handleScreenMouseLeave = () => {
    setCurrentScreen(null);
  };

  // set encoder, decoder
  useEffect(() => {
    (async () => {
      const encoders = await getEncoders(store);
      const decoders = await getFilteredDecoders(store);
      const deviceLinks = await getDeviceLinks({
        store: store,
        linkType: "video",
        isPreset: "N",
      });

      // set linked decoders list
      let linkedDecoders = [];
      if (deviceLinks && deviceLinks.length >= 0) {
        deviceLinks.forEach((deviceLink) => {
          if (deviceLink.deviceLinkDetails.length >= 0) {
            deviceLink.deviceLinkDetails.forEach((deviceLinkDetail) => {
              const decoderMac = deviceLinkDetail.decoder;
              linkedDecoders.push(decoderMac);
            });
          }
        });
      }

      let tempDecoders = []; // for set decoders
      decoders?.forEach((decoder) => {
        if (linkedDecoders.includes(decoder.mac)) {
          deviceLinks?.forEach((deviceLink) => {
            const encoderMac = deviceLink.encoder;
            if (deviceLink.deviceLinkDetails.length >= 0) {
              deviceLink.deviceLinkDetails.forEach((deviceLinkDetail) => {
                const decoderMac = deviceLinkDetail.decoder;
                encoders?.forEach((encoder) => {
                  if (
                    encoder.mac === encoderMac &&
                    decoder.mac === decoderMac
                  ) {
                    tempDecoders.push({
                      ...decoder,
                      previewUrl: encoder.previewUrl,
                      encoder: {
                        mac: encoder.mac,
                        nickName: encoder.nickName,
                      },
                      hasChanged: false,
                    });
                  }
                });
              });
            }
          });
        } else {
          tempDecoders.push({
            ...decoder,
            previewUrl: "",
            encoder: {
              mac: "",
              nickName: "",
            },
            hasChanged: false,
          });
        }
      });
      setEncoders(encoders);
      setOriginDecoders(tempDecoders.length > 0 ? tempDecoders : decoders);
      setDecoders(tempDecoders.length > 0 ? tempDecoders : decoders);
    })();
  }, [reload, store]);

  // filtered encoder list
  useEffect(() => {
    (async () => {
      let tempFilteredEncoders = [];
      encoders?.forEach((encoder) => {
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
      decoders?.forEach((decoder) => {
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
      const decoderMac = event.target.id.split("@")[1];
      decoders?.forEach((decoder) => {
        if (decoder.mac === decoderMac) {
          tempDecoders.push({
            ...decoder,
            previewUrl: selectedEncoder.previewUrl,
            encoder: {
              mac: selectedEncoder.mac,
              nickName: selectedEncoder.nickName,
            },
            hasChanged: true,
          });
        } else {
          tempDecoders.push(decoder);
        }
      });
      setDecoders(tempDecoders);
      setUpdateDecoderCards(Math.random());
      sessionStorage.setItem("singleScreenDec", tempDecoders);
    }
  };

  const handleClearScreen = async (event) => {
    const decoderMac = event.target.id.split("@")[1];
    let tempDecoders = decoders;
    tempDecoders?.forEach(async (decoder) => {
      if (decoder.mac === decoderMac && decoder.encoder !== "") {
        const result = await removeDeviceLink({
          store: store,
          linkType: `video`,
          encoder: decoder.encoder,
          decoders: [decoder.mac],
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

  const handleCancelScreenSetting = async (event) => {
    const decoderMac = event.target.id.split("@")[1];
    let tempDecoders = decoders;
    let originDecoder;
    tempDecoders?.forEach(async (decoder) => {
      if (decoder.mac === decoderMac && decoder.encoder !== "") {
        originDecoders?.forEach((oriDecoder) => {
          if (oriDecoder.mac === decoderMac) originDecoder = oriDecoder;
        });
        decoder.hasChanged = false;
        decoder.previewUrl = originDecoder.previewUrl;
        decoder.encoder = originDecoder.encoder;
      }
    });
    setDecoders(tempDecoders);
    const iframe = document.getElementById(`iframe.${decoderMac}`);
    iframe.src = originDecoder?.previewUrl
      ? modifyVideoSize(
          originDecoder?.previewUrl,
          store.siderCollapse ? 307 : 278,
          store.siderCollapse ? 237 : 213
        )
      : "";
  };

  const handleLinkScreen = (event) => {
    const decoderMac = event.target.id.split("@")[1];
    let tempDecoders = decoders;
    let createdLink = false;
    tempDecoders?.forEach(async (decoder) => {
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
          value1: "",
          remark: "",
          isPreset: "N",
        });
        if (result) {
          decoder.hasChanged = false;
          setDecoders(tempDecoders);
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
    filteredDecoders?.forEach((decoder) => {
      tempDecoderCards.push(
        <Col
          key={`col@${decoder.mac}`}
          id={`card@${decoder.mac}`}
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
            className={
              store.siderCollapse
                ? "single-screen-card-collapse"
                : "single-screen-card"
            }
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
                id={`iframe.${decoder.mac}`}
                className={
                  store.siderCollapse
                    ? "single-screen-card-video-collapse"
                    : "single-screen-card-video"
                }
                src={modifyVideoSize(
                  decoder.previewUrl,
                  store.siderCollapse ? 307 : 278,
                  store.siderCollapse ? 237 : 213
                )}
                title="Video player"
              />
            ) : null}
            <div
              id={`card@${decoder.mac}`}
              className={
                store.siderCollapse
                  ? "single-screen-card-top-collapse"
                  : "single-screen-card-top"
              }
              style={{
                backgroundColor:
                  currentScreen && currentScreen.includes(decoder.mac)
                    ? "gray"
                    : null,
              }}
            >
              <div
                id={`card@${decoder.mac}`}
                className={
                  store.siderCollapse
                    ? "single-screen-card-title-row-collapse"
                    : "single-screen-card-title-row"
                }
              >
                <span
                  id={`card@${decoder.mac}`}
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
                <span id={`card@${decoder.mac}`} style={{ marginTop: "2px" }}>
                  {decoder.state === "Up" ? (
                    <Tag
                      id={`card@${decoder.mac}`}
                      color={"#eef9b4"}
                      key={`${decoder.name}.${decoder.state}`}
                    >
                      <span
                        id={`card@${decoder.mac}`}
                        style={{ color: "#a0b628" }}
                        className="tag-content"
                      >
                        <FormattedMessage {...Messages.Text_Common_Up} />
                      </span>
                    </Tag>
                  ) : decoder.state === "Down" ? (
                    <Tag
                      id={`card@${decoder.mac}`}
                      color={"#ffe6e5"}
                      key={`${decoder.name}.${decoder.state}`}
                    >
                      <span
                        id={`card@${decoder.mac}`}
                        style={{ color: "#d55959" }}
                        className="tag-content"
                      >
                        <FormattedMessage {...Messages.Text_Common_Down} />
                      </span>
                    </Tag>
                  ) : (
                    <Tag
                      id={`card@${decoder.mac}`}
                      color={"yellow"}
                      key={`${decoder.name}.${decoder.state}`}
                    >
                      <span
                        id={`card@${decoder.mac}`}
                        style={{ color: "#d55959" }}
                        className="tag-content"
                      >
                        {decoder.state}
                      </span>
                    </Tag>
                  )}
                </span>
              </div>
              {currentScreen && currentScreen.includes(decoder.mac) ? (
                <div id={`card@${decoder.mac}`}>
                  <div
                    id={`card@${decoder.mac}`}
                    className="single-screen-card-desc"
                  >
                    <FormattedMessage {...Messages.Text_TVWall_VideoSource} />
                    {" : "}{" "}
                    {decoder.previewUrl
                      ? decoder.encoder?.nickName
                      : intl.formatMessage(Messages.Text_Common_None)}
                  </div>
                  <div
                    id={`card@${decoder.mac}`}
                    className={
                      store.siderCollapse
                        ? "single-screen-btn-position-collapse"
                        : "single-screen-btn-position"
                    }
                  >
                    {decoder.hasChanged ? (
                      <Button
                        id={`btn@${decoder.mac}`}
                        type="primary"
                        shape="circle"
                        style={{
                          background: "white",
                          position: "absolute",
                          marginLeft: -42,
                          display: decoder.hasChanged ? null : "none",
                          opacity: decoder.hasChanged ? 10 : 0,
                        }}
                        onClick={(event) => handleCancelScreenSetting(event)}
                      >
                        <img
                          id={`btn@${decoder.mac}`}
                          alt="cancel"
                          src={XIcon}
                          style={{ width: 18, height: 18, marginTop: 2 }}
                        />
                      </Button>
                    ) : null}
                    <Button
                      id={`btn@${decoder.mac}`}
                      type="primary"
                      shape="circle"
                      style={{ background: "black", position: "absolute" }}
                      onClick={(event) => handleClearScreen(event)}
                    >
                      <img
                        id={`btn@${decoder.mac}`}
                        alt="trash"
                        src={TrashIcon}
                        style={{ width: 18, height: 18, marginTop: 2 }}
                      />
                    </Button>
                    <Button
                      id={`btn@${decoder.mac}`}
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
                        id={`btn@${decoder.mac}`}
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
  }, [
    filteredDecoders,
    updateDecoderCards,
    currentScreen,
    store.siderCollapse,
  ]);

  const columns = [
    {
      title: intl.formatMessage(Messages.Text_Common_Name),
      dataIndex: "nickName",
      key: "nickName",
      render: (text) => {
        return (
          <span
            className="table-content"
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
      width: "35%",
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
      render: (text) => {
        return <span className="table-content">{text}</span>;
      },
    },
    {
      title: intl.formatMessage(Messages.Text_Common_State),
      width: "20%",
      key: "state",
      dataIndex: "state",
      sorter: (a, b) => a.state.length - b.state.length,
      render: (_, { state, name }) => (
        <>
          {state === "Up" ? (
            <Tag color={"#eef9b4"} key={`${name}.${state}`}>
              <span style={{ color: "#a0b628" }} className="tag-content">
                <FormattedMessage {...Messages.Text_Common_Up} />
              </span>
            </Tag>
          ) : state === "Down" ? (
            <Tag color={"#ffe6e5"} key={`${name}.${state}`}>
              <span style={{ color: "#d55959" }} className="tag-content">
                <FormattedMessage {...Messages.Text_Common_Down} />
              </span>
            </Tag>
          ) : (
            <Tag color={"yellow"} key={`${name}.${state}`}>
              <span className="tag-content">{state}</span>
            </Tag>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="single-screen-layout-column">
      <div>
        <div
          className={
            store.siderCollapse
              ? "single-screen-title-row-collapse"
              : "single-screen-title-row"
          }
        >
          <span className="page-title">
            <FormattedMessage {...Messages.Text_SingleScreen_Management} />
          </span>
        </div>
        <div
          className={
            store.siderCollapse
              ? "single-screen-title-row-collapse"
              : "single-screen-title-row"
          }
          style={{ marginTop: "16px" }}
        >
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
        <div
          className={
            store.siderCollapse
              ? "single-screen-title-row-collapse single-screen-card-container"
              : "single-screen-title-row single-screen-card-container"
          }
        >
          <Row gutter={15}>{decoderCards}</Row>
        </div>
      </div>
      <div
        className={
          store.siderCollapse
            ? "singlescreen-card-container-collapse"
            : "singlescreen-card-container"
        }
      >
        <Card className="singlescreen-card-right">
          <div className="singlescreen-card-right-title">
            <FormattedMessage {...Messages.Text_TVWall_VideoSource} />
          </div>
          <div className="singlescreen-card-right-desc">
            <FormattedMessage {...Messages.Text_TVWall_VideoSourceDesc} />
          </div>
          {/* <div className="singlescreen-card-right-preview">
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
          </div> */}
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
              pagination={{ pageSize: 11 }}
              onRow={(record) => ({
                onClick: () => {
                  handleChooseEncoder(record);
                },
              })}
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
