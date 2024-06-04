import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Card, Col, Input, Row, Tabs, Tag, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import useWindowDimensions from "../utils/WindowDimension";
import { createDeviceLink, getDecoders, getEncoders } from "../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
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
  const [searchFilter, setSearchFilter] = useState("");
  const [filteredEncoders, setFilteredEncoders] = useState([]);
  const [selectedEncoder, setSelectedEncoder] = useState({
    name: "",
    previewUrl: "",
  });
  const [currentScreen, setCurrentScreen] = useState(null);

  const handleScreenMouseEnter = (event) => {
    const itemId = event.target.id;
    console.log(itemId);
    setCurrentScreen(itemId);
  };

  const handleScreenMouseLeave = () => {
    setCurrentScreen(null);
  };

  const onScreenClick = (event) => {
    if (selectedEncoder.previewUrl) {
      let tempDecoders = [];
      const decoderMac = event.target.id.split("-")[1];
      console.log(decoderMac);
      console.log(decoders);
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

  const tabItems = [
    {
      key: "single-screen",
      label: "單顯示器",
      // children: <Row style={{ width: "100%" }}>{decoderCards}</Row>,
      onClick: () => {
        setTab("single-screen");
      },
    },
  ];

  // Set "normal/abnormal encoder list" when search filter is changed
  useEffect(() => {
    (async () => {
      let tempFilteredEncoders = [];
      const encoders = await getEncoders(store);
      setEncoders(encoders);

      encoders.forEach((encoder) => {
        if (encoder.nickName.includes(searchFilter))
          tempFilteredEncoders.push(encoder);
      });
      setFilteredEncoders(tempFilteredEncoders);
    })();
  }, [searchFilter]);

  const handleChooseEncoder = (encoder) => {
    setSelectedEncoder({
      mac: encoder.mac,
      previewUrl: encoder.previewUrl,
      nickName: encoder.nickName,
    });
  };

  useEffect(() => {
    (async () => {
      const decoders = await getDecoders(store);
      setDecoders(decoders);
    })();
  }, []);

  // Set "normal/abnormal encoder list" when search filter is changed
  useEffect(() => {
    (async () => {
      let tempFilteredDecoders = [];
      decoders.forEach((decoder) => {
        if (decoder.nickName.includes(searchDecoderFilter))
          tempFilteredDecoders.push(decoder);
      });
      setFilteredDecoders(tempFilteredDecoders);
    })();
  }, [searchDecoderFilter, decoders]);

  const modifyVideoSize = (previewUrl, width, height) => {
    const test = previewUrl.replace(/h.*&/, `h=${width}`);
    console.log(previewUrl, test);
    return "http://172.16.1.13:8080/?action=stream&w=174&h=221&fps=15&bw=5000&as=0";
  };

  useEffect(() => {
    let tempDecoderCards = [];
    filteredDecoders.forEach((decoder) => {
      tempDecoderCards.push(
        <Col span={6} id={`card-${decoder.mac}`}>
          <div
            className="single-screen-card"
            style={{
              backgroundColor:
                currentScreen === `card-${decoder.mac}` ? "gray" : "white",
            }}
            onMouseOver={handleScreenMouseEnter}
            onMouseLeave={handleScreenMouseLeave}
            onClick={onScreenClick}
          >
            {decoder.previewUrl ? (
              <embed
                style={{
                  width: document.getElementById(`card-${decoder.mac}`)
                    ?.clientWidth,
                  height: document.getElementById(`card-${decoder.mac}`)
                    ?.clientHeight,
                  position: "absolute",
                  overflow: "hidden",
                  paddingRight: 10,
                  paddingBottom: 12,
                }}
                // src={modifyVideoSize(
                //   decoder.previewUrl,
                //   document.getElementById(`card-${decoder.mac}`)?.clientWidth,
                //   document.getElementById(`card-${decoder.mac}`)?.clientHeight
                // )}
                src={decoder.previewUrl}
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
                marginRight: 12,
                backgroundColor:
                  currentScreen === `card-${decoder.mac}` ? "gray" : null,
              }}
            >
              <div className="single-screen-card-title-row">
                <span
                  id={`card-${decoder.mac}`}
                  className="single-screen-card-title"
                  style={{
                    color:
                      currentScreen === `card-${decoder.mac}`
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
              {/* todo !!!! wait for finish */}
              {currentScreen === `card-${decoder.mac}` ? (
                <div
                  id={`card-${decoder.mac}`}
                  className="single-screen-card-desc"
                >
                  <FormattedMessage {...Messages.Text_TVWall_VideoSource} />
                  {" : "} {decoder.encoder?.nickName}
                </div>
              ) : (
                <div
                  id={`card-${decoder.mac}`}
                  className="single-screen-card-desc"
                >
                  <FormattedMessage {...Messages.Text_TVWall_VideoSource} />
                  {" : "} <FormattedMessage {...Messages.Text_Common_None} />
                </div>
              )}
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
                <embed
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
              setSearchFilter(e.target.value);
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
