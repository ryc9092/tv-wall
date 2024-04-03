import { useState } from "react";
import { Button, Modal, Input } from "antd";
import SituationUSB from "../../pages/SituationUSB";
import { FormattedMessage } from "react-intl";
import Messages from "../../messages";
import "./addSituationContent.scss";

const PresetUSBModal = ({
  situationId,
  openParentModal,
  setReloadPresetDetails,
  detailsNum,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState(null);
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
        <FormattedMessage {...Messages.Text_Situation_USBManagement} />
      </Button>
      <Modal
        title={
          <div>
            <span style={{ marginRight: 12 }}>
              <FormattedMessage {...Messages.Text_Common_Description} />:
            </span>
            <Input
              style={{ width: 200 }}
              value={description}
              onChange={(e) => {
                setDescription(e.currentTarget.value);
              }}
            />
          </div>
        }
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
          description={description}
          openParentModal={setIsModalOpen}
          setReloadPresetDetails={setReloadPresetDetails}
          detailsNum={detailsNum}
          isModalOpen={isModalOpen}
          reload={reload}
          setDescription={setDescription}
        />
      </Modal>
    </div>
  );
};

export default PresetUSBModal;
