import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Modal, Table, Tag } from "antd";
import { getEncoders, getDecoders } from "../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import "./Status.scss";

const Status = () => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [devices, setDevices] = useState([]);
  const [details, setDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      let tempDevices = [];

      const encoders = await getEncoders(store);
      encoders.forEach((encoder) => {
        encoder.key = encoder.name;
        tempDevices.push(encoder);
      });

      const decoders = await getDecoders(store);
      decoders.forEach((decoder) => {
        decoder.key = decoder.name;
        tempDevices.push(decoder);
      });

      setDevices(tempDevices);
    })();
  }, []);

  const columns = [
    {
      title: intl.formatMessage(Messages.Text_DeviceStatus_Type),
      dataIndex: "type",
      key: "type",
      filters: [
        {
          text: intl.formatMessage(Messages.Text_DeviceStatus_Encoder),
          value: "encoder",
        },
        {
          text: intl.formatMessage(Messages.Text_DeviceStatus_Decoder),
          value: "decoder",
        },
      ],
      onFilter: (value, data) => data.type.indexOf(value) === 0,
    },
    {
      title: intl.formatMessage(Messages.Text_DeviceStatus_Name),
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: intl.formatMessage(Messages.Text_DeviceStatus_Alias),
      dataIndex: "nickName",
      key: "nickName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: intl.formatMessage(Messages.Text_DeviceStatus_State),
      key: "state",
      dataIndex: "state",
      sorter: (a, b) => a.state.length - b.state.length,
      render: (_, { state }) => (
        <>
          {state === "Up" ? (
            <Tag color={"green"} key={state}>
              {state}
            </Tag>
          ) : state === "Down" ? (
            <Tag color={"yellow"} key={state}>
              {state}
            </Tag>
          ) : (
            <Tag color={"red"} key={state}>
              {state}
            </Tag>
          )}
        </>
      ),
    },
    {
      title: intl.formatMessage(Messages.Text_DeviceStatus_Detail),
      dataIndex: ["name", "mac", "model", "productCode", "productDescription"],
      key: "details",
      render: (text, record) => (
        <Button
          onClick={() => {
            openDetailsModal(
              record.name,
              record.mac,
              record.model,
              record.productCode,
              record.productDescription
            );
          }}
        >
          <FormattedMessage {...Messages.Text_DeviceStatus_Content} />
        </Button>
      ),
    },
  ];

  const openDetailsModal = (
    name,
    mac,
    model,
    productCode,
    productDescription
  ) => {
    const tempDetails = (
      <>
        <span>
          <FormattedMessage {...Messages.Text_DeviceStatus_Name} />: {name}
        </span>
        <br />
        <span>MAC: {mac}</span>
        <br />
        <span>
          <FormattedMessage {...Messages.Text_DeviceStatus_Model} />: {model}
        </span>
        <br />
        <span>
          <FormattedMessage {...Messages.Text_DeviceStatus_ProductCode} />:{" "}
          {productCode}
        </span>
        <br />
        <span>
          <FormattedMessage {...Messages.Text_DeviceStatus_ProductDesc} />:{" "}
          {productDescription}
        </span>
      </>
    );
    setDetails(tempDetails);
    setIsModalOpen(true);
  };

  return (
    <div>
      {store.siderCollapse ? (
        <div className="page-title" style={{ marginTop: 20, marginBottom: 20 }}>
          <FormattedMessage {...Messages.Text_DeviceStatus_CurrentStatus} />
        </div>
      ) : (
        <div style={{ marginTop: 60, marginBottom: 20 }} />
      )}
      <Table columns={columns} dataSource={devices} style={{ width: "95%" }} />
      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={null}
      >
        {details}
      </Modal>
    </div>
  );
};

export default Status;
