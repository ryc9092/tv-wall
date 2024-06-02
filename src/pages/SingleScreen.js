import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Card, Col, Input, Radio, Row, Select, Switch, Tabs, Tag, Table, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import useWindowDimensions from "../utils/WindowDimension";
import { ENCODER_TYPERS, FAKE_ENCODERS } from "../utils/Constant";
import { getEncoders } from "../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import "../App.scss";
import "./SingleScreen.scss";

const SingleScreen = () => {
  const intl = useIntl();
  const { height, width } = useWindowDimensions();
  const [store] = useContext(StoreContext);
  const [encoders, setEncoders] = useState([]);
  const [encoderType, setEncoderType] = useState("1");
  const [searchFilter, setSearchFilter] = useState("");
  const [filteredEncoders, setFilteredEncoders] = useState([]);
  const [selectedEncoder, setSelectedEncoder] = useState({
    name: "",
    previewUrl: "",
  });
  const [isSmallElement, setIsSmallElement] = useState(false);

  const tabItems = [
    {
      key: '1',
      label: '單顯示器',
      children: 'Content of Tab Pane 1',
    },
  ];

  // The elements size would be changed according to width
  useEffect(() => {
    if (width > 960 && isSmallElement) setIsSmallElement(false);
    else if (width < 960 && !isSmallElement) setIsSmallElement(true);
  }, [isSmallElement, width]);

  let encoderElement = [];
  FAKE_ENCODERS.forEach((encoder) => {
    encoderElement.push(
      <Row key={encoder} style={{ marginTop: "10px" }}>
        <span className="encoder-normal-dot" />
        {encoder}
      </Row>
    );
  });

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

  const handleChooseEncoder = (event) => {
    setSelectedEncoder({
      name: event.currentTarget.id,
      previewUrl: event.currentTarget.value,
    });
  };

  const changeEncoderType = ({ target: { value } }) => {
    setEncoderType(value);
  };

  let encoderScreen = [];
  FAKE_ENCODERS.forEach((encoder) => {
    encoderScreen.push(
      <div
        key={`${encoder}-screen`}
        style={{
          margin: "12px 6px 0px 0px",
          height: "48%",
          width: "48%",
          textAlign: "center",
        }}
      >
        <div
          key={`${encoder}-screen`}
          style={{
            height: "82%",
            border: "1px solid gray",
            marginBottom: "2px",
          }}
        >
          {encoder}
        </div>
        <span style={{ textAlign: "center" }}>
          <Typography.Text style={{ fontSize: "14px", marginRight: "6px" }}>
            {encoder}
          </Typography.Text>
          <Switch style={{ marginTop: "-2px" }} />
        </span>
      </div>
    );
  });

  const columns = [
    {
      title: intl.formatMessage(Messages.Text_Common_Name),
      dataIndex: "nickName",
      key: "nickName",
      render: (text) => text,
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
            <Input className="single-screen-title-input singlescreen-input"
              variant="filled"
              prefix={<SearchOutlined />}
              placeholder={intl.formatMessage(Messages.Text_SingleScreen_InputDecoder)}
            />
        </div>
        <div className="single-screen-title-row" style={{marginTop: "16px"}}>
          <Tabs defaultActiveKey="1" items={tabItems} />
          <div>
            clear
          </div>
        </div>
        <div>
          screens
        </div>
      </div>
      <div
          className="singlescreen-card-container"
          style={{ minHeight: `${height - 8}px` }} // deduct topbar & padding
        >
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
                onRow={(record) => {
                  return {
                    onClick: () => {
                      handleChooseEncoder(record);
                    },
                  };
                }}
                style={{ maxHeight: `${height - 510}px`, marginBottom: 0 }}
              />
            </div>
            <div className="singlescreen-card-right-bottom">
              <div className="singlescreen-card-right-bottom-text">
                <FormattedMessage {...Messages.Text_SingleScreen_ConnectType} />
              </div>
                <Select className="singlescreen-card-right-bottom-select" />
            </div>
          </Card>
        </div>
    </div>
  );
};

export default SingleScreen;
