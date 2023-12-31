import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../../components/store/store";
import { Button, Modal, Table, Tag, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { getEncoders, getDecoders } from "../../../api/API";
import "../../../App.scss";
import "./deviceModal.scss";

const SettingDeviceModal = () => {
  const [store] = useContext(StoreContext);
  const [devices, setDevices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const editDevice = (e) => {
    console.log(e.currentTarget.id, "!!!");
  };

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
      console.log(tempDevices);
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
      title: "編輯",
      key: "edit",
      dataIndex: "id",
      render: (_, { id }) => (
        <div key={id} id={id} onClick={editDevice}>
          <EditOutlined className="device-edit" />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="setting-option-button"
      >
        <Typography.Text className="setting-option-text">
          設備進階設定
        </Typography.Text>
        <></>
        <EditOutlined className="setting-option-icon" />
      </Button>
      <Modal
        title={`設備進階設定`}
        className="modal-title"
        width={660}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <Table
          columns={columns}
          dataSource={devices}
          style={{ width: "95%", marginTop: 20 }}
        />
      </Modal>
    </div>
  );
};

export default SettingDeviceModal;
