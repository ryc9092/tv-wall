import { Button, Modal } from "antd";
import { FormattedMessage } from "react-intl";
import Messages from "../../messages";
import "../situation/addSituationContent.scss";
import "../situation/usbModal.scss";
import "./audioViewHintModal.scss";

const AudioViewHintModal = ({ isModalOpen, setIsModalOpen }) => {
  return (
    <div>
      {isModalOpen && (
        <Modal
          title={
            <span className="usb-modal-title">
              <FormattedMessage
                {...Messages.Text_Situation_ViewSituationItem}
              />
              {" - "}
              <FormattedMessage {...Messages.Text_Situation_AudioConnection} />
            </span>
          }
          className="usb-content modal-title"
          open={isModalOpen}
          footer={null}
          onCancel={() => {
            setIsModalOpen(false);
          }}
        >
          <div className="situation-view-audio-hint-text" style={{ marginTop: 24 }}>
            <FormattedMessage {...Messages.Text_Situation_ViewAudioHint} />
          </div>
          <Button
            className="situation-usb-item-cancel-btn"
            style={{ margin: "35px 0px 0px 318px" }}
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            <span className="item-cancel-btn-text">
              <FormattedMessage {...Messages.Text_Button_Close} />
            </span>
          </Button>
        </Modal>
      )}
    </div>
  );
};

export default AudioViewHintModal;
