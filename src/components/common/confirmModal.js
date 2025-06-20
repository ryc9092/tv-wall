import { Button, Modal } from "antd";
import { FormattedMessage } from "react-intl";
import Messages from "../../messages";

const ConfirmModal = ({ open, setOpen, width, onOk, title, content }) => {
  return (
    <Modal
      className="confirm-modal ant-modal-close-x"
      width={width}
      title={<span className="confirm-modal-title">{title}</span>}
      open={open}
      onCancel={() => {
        setOpen(false);
      }}
      onOk={onOk}
      footer={null}
    >
      <div className="confirm-modal-content">{content}</div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 32,
          marginBottom: 12,
        }}
      >
        <Button
          className="confirm-modal-cancel-btn"
          onClick={() => setOpen(false)}
        >
          <FormattedMessage {...Messages.Text_Button_Cancel} />
        </Button>
        <Button className="confirm-modal-ok-btn" onClick={onOk}>
          <FormattedMessage {...Messages.Text_Button_Delete} />
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
