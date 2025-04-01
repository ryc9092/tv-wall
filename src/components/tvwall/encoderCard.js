import React, { useEffect, useState } from "react";
import { Button, Card, Input, Table, Radio } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../messages";
import "../../App.scss";
import "./encoderCard.scss";
import "../../pages/TVWall.scss";

const EncoderCard = ({ encoders, selectedEncoder, setSelectedEncoder }) => {
  const intl = useIntl();
  const [showPreview, setShowPreview] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [filteredEncoders, setFilteredEncoders] = useState([]);

  // Set "encoder list" when search filter is changed
  useEffect(() => {
    (async () => {
      let tempFilteredEncoders = [];
      if (encoders) {
        encoders.forEach((encoder) => {
          if (encoder.nickName.includes(searchFilter))
            tempFilteredEncoders.push({ key: encoder.mac, ...encoder });
        });
      }
      setFilteredEncoders(tempFilteredEncoders);
    })();
  }, [encoders, searchFilter]);

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

  const columns = [
    {
      dataIndex: ["mac", "state"],
      key: "radio",
      render: (text, record) => {
        return (
          <Radio
            disabled={record.state !== "Up"}
            id={`btn@${record.mac}`}
            checked={selectedEncoder.mac === record.mac}
          />
        );
      },
    },
    {
      title: intl.formatMessage(Messages.Text_Common_EncoderName),
      dataIndex: "nickName",
      key: "nickName",
      minWidth: 80,
      render: (text, record) => {
        return (
          <span
            className="table-content"
            style={record.state !== "Up" ? { color: "#c33434" } : null}
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
      minWidth: 60,
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
  ];

  return (
    <div className="card-container">
      <Card className="encoder-card">
        <div className="encoder-card-title-column">
          <div className="encoder-card-title">
            <FormattedMessage {...Messages.Text_TVWall_VideoSource} />
          </div>
          <div>
            <Button
              onClick={() => {
                setShowPreview(!showPreview);
              }}
              style={{
                marginTop: 6,
                marginBottom: 12,
                border: 0,
                padding: 5,
                boxShadow: "none",
              }}
            >
              <EyeOutlined style={{ fontSize: 16 }} />
            </Button>
          </div>
        </div>
        <div className="encoder-card-desc">
          <FormattedMessage {...Messages.Text_TVWall_VideoSourceDesc} />
        </div>
        {showPreview ? (
          <div className="encoder-preview">
            {selectedEncoder.nickName ? (
              <div>
                <iframe
                  className="encoder-preview-video"
                  src={selectedEncoder.previewUrl}
                  title="Video player"
                />
                <span>{selectedEncoder.nickName}</span>
              </div>
            ) : (
              <div className="encoder-preview-text">
                <FormattedMessage {...Messages.Text_TVWall_Preview} />
              </div>
            )}
          </div>
        ) : (
          <div className="none-preview"></div>
        )}
        <Input
          className="encoder-card-search encoder-search-input"
          variant="filled"
          onChange={(e) => {
            setSearchFilter(e.target.value);
          }}
          prefix={<SearchOutlined />}
          placeholder={intl.formatMessage(Messages.Text_TVWall_InputEncoder)}
        />
        <div
          className={
            showPreview
              ? "encoder-card-table-container"
              : "encoder-card-table-container-without-preview"
          }
        >
          <Table
            columns={columns}
            size="small"
            dataSource={filteredEncoders}
            pagination={{ pageSize: 11 }}
            onRow={(record) => ({
              onClick: () => {
                if (record.state === "Up") handleChooseEncoder(record);
              },
            })}
          />
        </div>
      </Card>
    </div>
  );
};

export default EncoderCard;
