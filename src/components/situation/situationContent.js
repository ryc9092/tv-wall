import { useContext, useEffect, useState } from "react";
import { Button, Modal, Table, Typography } from "antd";
import AddSituationContentModal from "./addSituationContent";
import "./createSituation.scss";

const SituationContentModal = ({ id, name, desc }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        title={name}
        className="modal-title"
        width={700}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <AddSituationContentModal id={id} />
        <Table columns={columns} dataSource={data} />
      </Modal>
    </div>
  );
};

export default SituationContentModal;
