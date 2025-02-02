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
import ScreenBackgroundImage from "../assets/screenBackground.png";
import ClearLinkIcon from "../assets/clearLink.png";
import ClearLinkDisabledIcon from "../assets/clearLinkDisabled.png";
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
  const [goingToModifyDecoder, setGoingToModifyDecoder] = useState({});

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
          });
        }
      });
      setEncoders(encoders);
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

  const onScreenClick = (event, selectedEncoder) => {
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

  const handleLinkScreen = (event) => {
    const decoderMac = event.target.id.split("@")[1];
    let tempDecoders = decoders;
    let createdLink = false;
    tempDecoders?.forEach((decoder) => {
      if (
        decoder.mac === decoderMac &&
        decoder.encoder &&
        decoder.encoder.mac !== "" &&
        createdLink === false
      ) {
        createdLink = true;
        createDeviceLink({
          store: store,
          id: `video.${decoder.mac}`,
          linkType: "video",
          encoder: decoder.encoder.mac,
          decoders: [decoder.mac],
          value1: "",
          remark: "",
          isPreset: "N",
        }).then((result) => {
          if (result) {
            setGoingToModifyDecoder({
              decoderMac: decoder.mac,
              previewUrl: decoder.previewUrl,
              encoder: {
                mac: selectedEncoder.mac,
                nickName: selectedEncoder.nickName,
              },
            });
            showSuccessNotificationByMsg(
              intl.formatMessage(Messages.Text_SingleScreen_VideoPlaySuccess)
            );
          } else {
            setGoingToModifyDecoder({});
            showWarningNotification(
              intl.formatMessage(Messages.Text_SingleScreen_VideoPlayFail)
            );
          }
        });
      }
    });
  };

  useEffect(() => {
    let tempDecoders = [];
    decoders?.forEach((decoder) => {
      if (decoder.mac === goingToModifyDecoder.decoderMac) {
        tempDecoders.push({
          ...decoder,
          previewUrl: goingToModifyDecoder.previewUrl,
          encoder: goingToModifyDecoder.encoder,
        });
      } else {
        tempDecoders.push(decoder);
      }
    });
    setDecoders(tempDecoders);
  }, [goingToModifyDecoder]);

  useEffect(() => {
    let tempDecoderCards = [];
    filteredDecoders?.forEach((decoder) => {
      tempDecoderCards.push(
        <Col
          key={`col@${decoder.mac}`}
          id={`card@${decoder.mac}`}
        >
          <div
            id={`card@${decoder.mac}`}
            className="single-screen-card-outer"
            style={decoder.encoder.mac ? { backgroundImage: `url(${ScreenBackgroundImage}` } : null}
            onMouseOver={handleScreenMouseEnter}
            onMouseLeave={handleScreenMouseLeave}
            onClick={(event) => {
              onScreenClick(event, selectedEncoder);
            }}
          >
            <div
              id={`card@${decoder.mac}`}
              className={currentScreen && currentScreen.includes(decoder.mac) ? "single-screen-card-selected" : decoder.encoder.mac ? "single-screen-card-with-source" : "single-screen-card"}
            >
              <div
                id={`card@${decoder.mac}`}
                className="single-screen-card-title-row"
              >
                <span
                  id={`card@${decoder.mac}`}
                  className={currentScreen && currentScreen.includes(decoder.mac) ? "single-screen-card-title-selected" : "single-screen-card-title"}
                >
                  {decoder.nickName.length > 10 ? decoder.nickName.substring(0, 10) + "..." : decoder.nickName}
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
              <div id={`card@${decoder.mac}`}>
                <div
                  id={`card@${decoder.mac}`}
                  className={currentScreen && currentScreen.includes(decoder.mac) ? "single-screen-card-desc-selected" : "single-screen-card-desc"}
                >
                  <FormattedMessage {...Messages.Text_TVWall_VideoSource} />
                  {" : "}{" "}
                  {decoder.previewUrl
                    ? decoder.encoder?.nickName
                    : intl.formatMessage(Messages.Text_Common_None)}
                </div>
                <div
                  id={`card@${decoder.mac}`}
                  className="single-screen-btn-position"
                >
                  {decoder.encoder.mac ? (
                    <Button
                      id={`btn@${decoder.mac}`}
                      type="primary"
                      style={{
                        color: "#e7e7e7",
                        backgroundColor: "#262320",
                        position: "absolute",
                        borderRadius: "20px",
                      }}
                      onClick={(event) => handleClearScreen(event)}
                    >
                      <div style={{ display: "flex" }}>
                        <img
                          id={`btn@${decoder.mac}`}
                          alt="clear link"
                          src={ClearLinkIcon}
                          style={{ width: 18, height: 18, marginTop: 2, marginRight: 6 }}
                        />
                        <span
                          id={`btn@${decoder.mac}`}
                          className="single-screen-btn-text"
                        >
                          <FormattedMessage
                            {...Messages.Text_Button_ClearSource}
                          />
                        </span>
                      </div>
                    </Button>) : (
                    <Button
                      id={`btn@${decoder.mac}`}
                      type="primary"
                      disabled
                      style={{
                        color: "#a5a5a5",
                        backgroundColor: "#c6c6c6",
                        position: "absolute",
                        borderRadius: "20px",
                      }}
                    // onClick={(event) => handleLinkScreen(event)}
                    >
                      <div style={{ display: "flex" }}>
                        <img
                          id={`btn@${decoder.mac}`}
                          alt="clear link"
                          src={ClearLinkDisabledIcon}
                          style={{ width: 18, height: 18, marginTop: 2, marginRight: 6 }}
                        />
                        <span
                          id={`btn@${decoder.mac}`}
                          className="single-screen-btn-text"
                        >
                          <FormattedMessage
                            {...Messages.Text_Button_ClearSource}
                          />
                        </span>
                      </div>
                    </Button>)}
                </div>
              </div>
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
    selectedEncoder,
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
        <Row gutter={[15, 15]}>{decoderCards}</Row>
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
        </Card>
      </div>
    </div>
  );
};

export default SingleScreen;
