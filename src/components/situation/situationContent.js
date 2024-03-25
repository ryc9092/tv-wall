import { useContext, useEffect, useState } from "react";
import { Button, Form, Input, Modal, Table, Typography } from "antd";
import "./createSituation.scss";

const SituationContentModal = ({ desc }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onFinish = async () => {
    // todo: integrate with create situation api
    setIsModalOpen(false);
  };

  const data = [];

  const columns = [
    {
      title: "order", // todo: antd table -> Drag sorting with handler
      dataIndex: "type",
      key: "type",
    },
    {
      title: "type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "desc",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "operation",
      dataIndex: "type",
      key: "type",
    },
  ];

  return (
    <div>
      <span>{desc}</span>
      <Button
        onClick={() => setIsModalOpen(true)}
        style={{ float: "right", marginTop: -6 }}
      >
        <Typography.Text>edit</Typography.Text>
      </Button>
      <Modal
        title="situation content"
        className="modal-title"
        width={700}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <Table columns={columns} dataSource={data} />
      </Modal>
    </div>
  );
};

export default SituationContentModal;
