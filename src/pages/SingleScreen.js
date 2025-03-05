import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Card, Col, Input, Radio, Row, Tag, Table } from "antd";
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
    nickName: "",
    mac: "",
    previewUrl: "",
  });
  const [reload, setReload] = useState(null);

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

  const [chooseEncoderTime, setChooseEncoderTime] = useState(null);
  const handleChooseEncoder = (encoder) => {
    // prevent choose encoder interval too short
    if (chooseEncoderTime === null || Date.now() - chooseEncoderTime > 300) {
      // unselect encoder if it already selected
      if (selectedEncoder.mac === encoder.mac)
        setSelectedEncoder({
          nickName: "",
          mac: "",
          previewUrl: "",
        });
      else
        setSelectedEncoder({
          nickName: encoder.nickName,
          mac: encoder.mac,
          previewUrl: encoder.previewUrl,
        });
    }
    setChooseEncoderTime(Date.now());
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

  const [selectedScreen, setSelectedScreen] = useState(null);
  useEffect(() => {
    let tempDecoderCards = [];
    filteredDecoders?.forEach((decoder) => {
      tempDecoderCards.push(
        <Col key={`col@${decoder.mac}`} id={`card@${decoder.mac}`}>
          <div
            id={`card@${decoder.mac}`}
            className="single-screen-card-outer"
            style={
              decoder.encoder.mac
                ? { backgroundImage: `url(${ScreenBackgroundImage}` }
                : null
            }
            onClick={(event) => {
              if (!event.target.id.includes("btn")) {
                const decoderMac = event.target.id.split("@")[1];
                // already selected, unselected it
                if (selectedScreen === decoderMac) setSelectedScreen(null);
                else setSelectedScreen(decoderMac);
              }
            }}
          >
            <div
              id={`card@${decoder.mac}`}
              className={
                selectedScreen === decoder.mac
                  ? "single-screen-card-selected"
                  : decoder.encoder.mac
                  ? "single-screen-card-with-source"
                  : "single-screen-card"
              }
            >
              <div
                id={`card@${decoder.mac}`}
                className="single-screen-card-title-row"
              >
                <span
                  id={`card@${decoder.mac}`}
                  className={
                    selectedScreen === decoder.mac
                      ? "single-screen-card-title-selected"
                      : "single-screen-card-title"
                  }
                >
                  {decoder.nickName.length > 10
                    ? decoder.nickName.substring(0, 10) + "..."
                    : decoder.nickName}
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
                  className={
                    selectedScreen === decoder.mac
                      ? "single-screen-card-desc-selected"
                      : "single-screen-card-desc"
                  }
                >
                  <FormattedMessage {...Messages.Text_TVWall_VideoSource} />
                  {" : "}{" "}
                  {decoder.encoder?.nickName
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
                        zIndex: 100,
                      }}
                      onClick={(event) => handleClearScreen(event)}
                    >
                      <div style={{ display: "flex" }}>
                        <img
                          id={`btn@${decoder.mac}`}
                          alt="clear link"
                          src={ClearLinkIcon}
                          style={{
                            width: 18,
                            height: 18,
                            marginTop: 2,
                            marginRight: 6,
                          }}
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
                    </Button>
                  ) : (
                    <Button
                      id={`btn@${decoder.mac}`}
                      type="primary"
                      disabled
                      style={{
                        color: "#a5a5a5",
                        backgroundColor: "#c6c6c6",
                        position: "absolute",
                        borderRadius: "20px",
                        zIndex: 100,
                      }}
                    >
                      <div style={{ display: "flex" }}>
                        <img
                          id={`btn@${decoder.mac}`}
                          alt="clear link"
                          src={ClearLinkDisabledIcon}
                          style={{
                            width: 18,
                            height: 18,
                            marginTop: 2,
                            marginRight: 6,
                          }}
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
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Col>
      );
    });
    setDecoderCards(tempDecoderCards);
  }, [selectedScreen, filteredDecoders, selectedEncoder, store.siderCollapse]);

  useEffect(() => {
    const handleLinkScreen = (decoderMac, encoderMac) => {
      createDeviceLink({
        store: store,
        id: `video.${decoderMac}`,
        linkType: "video",
        encoder: encoderMac,
        decoders: [decoderMac],
        value1: "",
        remark: "",
        isPreset: "N",
      }).then((result) => {
        if (result) {
          showSuccessNotificationByMsg(
            intl.formatMessage(Messages.Text_SingleScreen_VideoPlaySuccess)
          );
        } else {
          showWarningNotification(
            intl.formatMessage(Messages.Text_SingleScreen_VideoPlayFail)
          );
        }
        setSelectedScreen(null);
        setSelectedEncoder({
          nickName: "",
          mac: "",
          previewUrl: "",
        });
        setReload(Math.random());
      });
    };
    if (selectedScreen && selectedEncoder.mac) {
      handleLinkScreen(selectedScreen, selectedEncoder.mac);
    }
  }, [selectedScreen, selectedEncoder, store, intl]);

  const columns = [
    {
      dataIndex: "mac",
      key: "radio",
      render: (text) => {
        return (
          <Radio id={`btn@${text}`} checked={selectedEncoder.mac === text} />
        );
      },
    },
    {
      title: intl.formatMessage(Messages.Text_Common_Name),
      dataIndex: "nickName",
      key: "nickName",
      minWidth: 55,
      render: (text) => {
        return <span className="single-screen-table-content">{text}</span>;
      },
    },
    {
      title: intl.formatMessage(Messages.Text_Common_Model),
      dataIndex: "model",
      key: "model",
      minWidth: 110,
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
        return <span className="single-screen-table-content">{text}</span>;
      },
    },
    {
      title: intl.formatMessage(Messages.Text_Common_State),
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
          <span className="page-title sdcp-font">
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
        <Row className="single-screen-left-container" gutter={[15, 15]}>
          {decoderCards}
        </Row>
      </div>
      <div className="singlescreen-card-container">
        <Card className="singlescreen-card-right">
          <div className="singlescreen-card-right-title">
            <FormattedMessage {...Messages.Text_TVWall_VideoSource} />
          </div>
          <div className="singlescreen-card-right-desc">
            <FormattedMessage {...Messages.Text_TVWall_VideoSourceDesc} />
          </div>
          <div className="singlescreen-card-right-preview">
            {selectedEncoder.nickName ? (
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
              pagination={{ pageSize: 11 }}
              onRow={(record) => ({
                onClick: () => {
                  handleChooseEncoder(record);
                },
              })}
              size="small"
              tableLayout="auto"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SingleScreen;
