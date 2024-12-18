import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Input, Popover, Table, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getEncoders, getDecoders, rebootDevice } from "../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
} from "../utils/Utils";
import SearchIcon from "../assets/magnifying-glass.png";
import "./Status.scss";

const Status = () => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [devices, setDevices] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    (async () => {
      let tempDevices = [];
      const encoders = await getEncoders(store);
      encoders?.forEach((encoder) => {
        if (encoder.nickName.includes(searchFilter)) {
          encoder.key = encoder.name;
          tempDevices.push(encoder);
        }
      });
      const decoders = await getDecoders(store);
      decoders?.forEach((decoder) => {
        if (decoder.nickName.includes(searchFilter)) {
          decoder.key = decoder.name;
          tempDevices.push(decoder);
        }
      });
      setDevices(tempDevices);
    })();
  }, [searchFilter, store]);

  // Clear interval before set
  // window.clearInterval(window.retriveDevicesTimer);

  // Set interval to update devices
  // window.retriveDevicesTimer = setInterval(retriveDevices, 10000);

  const reboot = async (mac) => {
    let result = await rebootDevice(mac, store);
    if (result) {
      showSuccessNotificationByMsg(
        intl.formatMessage(Messages.Text_DeviceStatus_RestartSuccess)
      );
    } else
      showWarningNotification(
        intl.formatMessage(Messages.Text_DeviceStatus_RebootFail)
      );
  };

  const columns = [
    {
      title: intl.formatMessage(Messages.Text_Common_Type),
      width: "17%",
      dataIndex: "type",
      key: "type",
      filters: [
        {
          text: intl.formatMessage(Messages.Text_Common_Encoder),
          value: "encoder",
        },
        {
          text: intl.formatMessage(Messages.Text_Common_Decoder),
          value: "decoder",
        },
      ],
      onFilter: (value, data) => data.type.indexOf(value) === 0,
      render: (text) => <span className="table-content">{text}</span>,
    },
    {
      title: intl.formatMessage(Messages.Text_Common_Name),
      dataIndex: "nickName",
      key: "nickName",
      render: (text) => <span className="table-content">{text}</span>,
    },
    {
      title: intl.formatMessage(Messages.Text_Common_State),
      width: "15%",
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
    {
      title: intl.formatMessage(Messages.Text_DeviceStatus_MonitorSwitch),
      width: "15%",
      key: "switch",
      dataIndex: "state",
      render: (_, { state, mac }) => (
        <Button
          onClick={() => {
            reboot(mac);
          }}
          className="table-content"
        >
          <FormattedMessage {...Messages.Text_DeviceStatus_Reboot} />
        </Button>
      ),
    },
    {
      title: intl.formatMessage(Messages.Text_Common_Detail),
      width: "13%",
      dataIndex: ["name", "mac", "model", "productCode", "productDescription"],
      key: "detail",
      render: (text, record) => {
        const content = (
          <div className="table-content">
            IP : {record.ip}
            <br />
            MAC : {record.mac}
            <br />
            <FormattedMessage {...Messages.Text_DeviceStatus_Model} />
            {" : "}
            {record.model}
            <br />
            <FormattedMessage {...Messages.Text_DeviceStatus_ProductCode} />
            {" : "}
            {record.productCode}
            <br />
            <FormattedMessage {...Messages.Text_DeviceStatus_ProductDesc} />
            {" : "}
            {record.productDescription}
          </div>
        );
        return (
          <Popover content={content}>
            <img
              id={`btn-${record.mac}`}
              alt="search"
              src={SearchIcon}
              className="icon-button"
            />
          </Popover>
        );
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
        <div className="status-title-row">
          <span className="page-title">
            <FormattedMessage {...Messages.Text_DeviceStatus_CurrentStatus} />
          </span>
          <Input
            className="status-title-input status-input"
            variant="filled"
            onChange={(e) => {
              setSearchFilter(e.target.value);
            }}
            prefix={<SearchOutlined />}
            placeholder={intl.formatMessage(
              Messages.Text_DeviceStatus_InputDeviceName
            )}
          />
        </div>
        <div className="status-content-container">
          <Table
            className="status-content-table"
            columns={columns}
            dataSource={devices}
            pagination={{ pageSize: 11 }}
            size={"small"}
          />
        </div>
      </div>
    </div>
  );
};

export default Status;
