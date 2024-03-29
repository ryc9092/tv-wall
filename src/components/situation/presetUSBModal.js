import { useState } from "react";
import { Button, Modal } from "antd";
import SituationUSB from "../../pages/SituationUSB";
import "./addSituationContent.scss";

const PresetUSBModal = ({
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
        USB管理
      </Button>
      <Modal
        title="USB管理"
        width={1200}
        open={isModalOpen}
        footer={null}
        style={{ marginTop: -95 }}
        onCancel={() => {
          setReload(Math.random());
          setIsModalOpen(false);
        }}
      >
        <SituationUSB
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

export default PresetUSBModal;
