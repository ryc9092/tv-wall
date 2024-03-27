import { useState } from "react";
import { Button, Modal } from "antd";
import SituationTVWall from "../../pages/SituationTVWall";
import "./addSituationContent.scss";

const PresetWallModal = ({ id, openParentModal }) => {
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
        電視牆面影音管理
      </Button>
      <Modal
        title="wall"
        width={1200}
        open={isModalOpen}
        footer={null}
        style={{ marginTop: -90 }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <SituationTVWall />
      </Modal>
    </div>
  );
};

export default PresetWallModal;
