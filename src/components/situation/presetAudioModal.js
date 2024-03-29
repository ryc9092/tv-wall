import { useState } from "react";
import { Button, Modal } from "antd";
import SituationAudio from "../../pages/SituationAudio";
import "./addSituationContent.scss";

const PresetAudioModal = ({
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
          setReload(Math.random());
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
          setReload(Math.random());
          setIsModalOpen(false);
        }}
      >
        <SituationAudio
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

export default PresetAudioModal;
