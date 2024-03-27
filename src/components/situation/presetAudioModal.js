import { useState } from "react";
import { Button, Modal } from "antd";
import "./addSituationContent.scss";

const PresetAudioModal = ({ id, openParentModal }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Button
        id={id}
        className="situation-option-button"
        onClick={() => {
          openParentModal(false);
          setIsModalOpen(true);
        }}
      >
        音頻管理
      </Button>
      <Modal
        title="音頻管理"
        width={1200}
        open={isModalOpen}
        footer={null}
        style={{ marginTop: -90 }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      ></Modal>
    </div>
  );
};

export default PresetAudioModal;
