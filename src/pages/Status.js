import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Modal, Table, Tag } from "antd";
import { getEncoders, getDecoders } from "../api/API";
import "./Status.scss";

const Status = () => {
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
      title: "類型",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "編碼器", value: "encoder" },
        { text: "解碼器", value: "decoder" },
      ],
      onFilter: (value, data) => data.type.indexOf(value) === 0,
    },
    {
      title: "名稱",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "別名",
      dataIndex: "nickName",
      key: "nickName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "狀態",
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
      title: "詳細資訊",
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
          內容
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
        <span>名稱: {name}</span>
        <br />
        <span>MAC: {mac}</span>
        <br />
        <span>模型: {model}</span>
        <br />
        <span>產品編號: {productCode}</span>
        <br />
        <span>產品描述: {productDescription}</span>
      </>
    );
    setDetails(tempDetails);
    setIsModalOpen(true);
  };

  return (
    <div>
      {store.siderCollapse ? (
        <div className="page-title" style={{ marginTop: 20, marginBottom: 20 }}>
          設備即時狀態
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
