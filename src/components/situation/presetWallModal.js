import { useState } from "react";
import { Button, Input, Modal } from "antd";
import SituationTVWall from "../../pages/SituationTVWall";
import { FormattedMessage } from "react-intl";
import Messages from "../../messages";
import "./addSituationContent.scss";

const PresetWallModal = ({
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
          openParentModal(false);
          setIsModalOpen(true);
        }}
      >
        <FormattedMessage {...Messages.Text_Situation_TVWallManagement} />
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
        style={{ marginTop: -90 }}
        onCancel={() => {
          setReload(Math.random());
          setIsModalOpen(false);
        }}
      >
        <SituationTVWall
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

export default PresetWallModal;
