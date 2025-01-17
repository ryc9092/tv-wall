import { StoreContext } from "../store/store";
import { Button, Form, Input, Modal } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { createSituation } from "../../api/API";
import { uuid } from "../../utils/Utils";
import Messages from "../../messages";
import { showWarningNotification } from "../../utils/Utils";
import "../../pages/Situation.scss";
import "./confirmModal.scss";

const ConfirmModal = ({
  title,
  description,
  isModalOpen,
  setIsModalOpen,
  setHasConfirm,
}) => {
  const intl = useIntl();

  return (
    <div>
      <Modal
        title=<span className="confirm-modal-title">
          {/* {intl.formatMessage(Messages.Text_Situation_CreateSituation)} */}
          {title}
        </span>
        className="confirm-modal modal-title"
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <br />
        <span className="confirm-modal-description">{description}</span>
        <br />
        <br />
        <br />
        <Button
          onClick={() => {
            console.log("click");
            setHasConfirm(true);
            setIsModalOpen(false);
          }}
        >
          test
        </Button>
      </Modal>
    </div>
  );
};

export default ConfirmModal;
