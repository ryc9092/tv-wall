import { useState } from "react";
import { Button, Modal } from "antd";
import "./addSituationContent.scss";

const PresetWallModal = ({ id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Button
        id={id}
        className="situation-option-button"
        onClick={() => setIsModalOpen(true)}
      >
        電視牆面影音管理
      </Button>
      <Modal
        title="wall"
        width={700}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      ></Modal>
    </div>
  );
};

export default PresetWallModal;
