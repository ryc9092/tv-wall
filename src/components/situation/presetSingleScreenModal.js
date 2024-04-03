import { useState } from "react";
import { Button, Modal } from "antd";
import { FormattedMessage } from "react-intl";
import Messages from "../../messages";
import "./addSituationContent.scss";

const PresetSingleScreenModal = ({ id, openParentModal }) => {
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
        <FormattedMessage {...Messages.Text_Situation_SingleScreenManagement} />
      </Button>
      <Modal
        title="單畫面影音管理"
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

export default PresetSingleScreenModal;
