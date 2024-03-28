import { useState } from "react";
import { Button, Modal } from "antd";
import SituationTVWall from "../../pages/SituationTVWall";
import "./addSituationContent.scss";

const PresetWallModal = ({
  situationId,
  openParentModal,
  setReloadPresetDetails,
  detailsNum,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reload, setReload] = useState(null);
  return (
    <div>
      <Button
        situationId={situationId}
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
          setReload(Math.random());
          setIsModalOpen(false);
        }}
      >
        <SituationTVWall
          situationId={situationId}
          openParentModal={setIsModalOpen}
          setReloadPresetDetails={setReloadPresetDetails}
          detailsNum={detailsNum}
          reload={reload}
        />
      </Modal>
    </div>
  );
};

export default PresetWallModal;
