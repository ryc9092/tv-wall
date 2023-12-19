import React, { useContext } from "react";
import { StoreContext } from "../components/store/store";
import { Table, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";
import "./Status.scss";

const Status = () => {
  const [store] = useContext(StoreContext);

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
      title: "號碼",
      dataIndex: "id",
      key: "id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "狀態",
      key: "status",
      dataIndex: "status",
      sorter: (a, b) => a.status.length - b.status.length,
      render: (_, { status }) => (
        <>
          {status === "nice" ? (
            <Tag color={"green"} key={status}>
              {status}
            </Tag>
          ) : (
            <Tag color={"volcano"} key={status}>
              {status}
            </Tag>
          )}
        </>
      ),
    },
    {
      title: "編輯",
      key: "edit",
      dataIndex: "id",
      render: (_, { id }) => (
        <div key={id} id={id} onClick={editDevice}>
          <EditOutlined className="device-status-edit" />
        </div>
      ),
    },
  ];

  const editDevice = (e) => {
    console.log(e.currentTarget.id, "!!!");
  };

  const data = [
    {
      key: "1",
      type: "encoder",
      name: "encoder1",
      id: "encoder1",
      status: "nice",
    },
    {
      key: "2",
      type: "encoder",
      name: "encoder2",
      id: "encoder2",
      status: "nice",
    },
    {
      key: "3",
      type: "encoder",
      name: "encoder3",
      id: "encoder3",
      status: "bad",
    },
    {
      key: "4",
      type: "decoder",
      name: "decoder4",
      id: "decoder4",
      status: "bad",
    },
    {
      key: "5",
      type: "encoder",
      name: "encoder1",
      id: "encoder5",
      status: "nice",
    },
    {
      key: "6",
      type: "encoder",
      name: "encoder2",
      id: "encoder6",
      status: "nice",
    },
    {
      key: "7",
      type: "encoder",
      name: "encoder7",
      id: "encoder7",
      status: "bad",
    },
    {
      key: "8",
      type: "decoder",
      name: "decoder4",
      id: "decoder8",
      status: "bad",
    },
  ];

  return (
    <div>
      {store.siderCollapse ? (
        <div className="page-title" style={{ marginTop: 20, marginBottom: 20 }}>
          設備即時狀態
        </div>
      ) : (
        <div style={{ marginTop: 60, marginBottom: 20 }} />
      )}
      <Table columns={columns} dataSource={data} style={{ width: "95%" }} />
    </div>
  );
};

export default Status;
