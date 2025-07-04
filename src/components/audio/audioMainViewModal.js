import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../store/store";
import { Button, Modal, Table } from "antd";
import { getSituationDetails, getSituations } from "../../api/API";
import AudioViewModal from "./audioViewModal";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../messages";
import ViewIcon from "../../assets/view.png";
import "../situation/addSituationContent.scss";
import "../situation/usbModal.scss";
import "../usb/usbViewModal.scss";
import useWindowDimensions from "../../utils/WindowDimension";

const audioSituationCategory = "2";

const AudioMainViewModal = ({
  audioSituationId,
  isModalOpen,
  setIsModalOpen,
}) => {
  const intl = useIntl();
  const { height } = useWindowDimensions();
  const [store] = useContext(StoreContext);

  // get the choosed view situation items
  const [viewSituation, setViewSituation] = useState(null);
  const [viewSituationItems, setViewSituationItems] = useState([]);
  useEffect(() => {
    (async () => {
      const audioSituations = await getSituations(
        store,
        audioSituationCategory
      );

      let detail = await getSituationDetails(store, audioSituationId);
      let tempSituation;
      audioSituations.forEach((situation) => {
        if (situation.id === audioSituationId) tempSituation = situation;
      });
      setViewSituationItems(detail);
      setViewSituation(tempSituation);
    })();
  }, [audioSituationId, store]);

  // view connections
  const [isAudioViewModalOpen, setIsAudioViewModalOpen] = useState(false);
  const [choosedSituationItemId, setChoosedSituationItemId] = useState(null);
  const [linkType, setLinkType] = useState(null);
  const handleViewSituationItem = async (situationDetailRelationId, type) => {
    setChoosedSituationItemId(situationDetailRelationId);
    setLinkType(type);
    setIsAudioViewModalOpen(true);
  };

  const detailColumns = [
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_Common_Step)}
        </span>
      ),
      dataIndex: "orderNum",
      key: "orderNum",
      width: "7%",
      render: (text) => <span className="table-content">{text}</span>,
    },
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_Audio_SubAudioClass)}
        </span>
      ),
      dataIndex: "set_type",
      key: "type",
      render: (text) => (
        <span className="table-content">
          {intl.formatMessage(Messages[`Text_Situation_Item${text}`])}
        </span>
      ),
    },
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_Common_Description)}
        </span>
      ),
      dataIndex: "remark",
      key: "description",
      render: (text) => {
        return <div className="table-content audio-remark-col">{text}</div>;
      },
    },
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_Button_Operation)}
        </span>
      ),
      width: "15%",
      dataIndex: "id",
      key: "operate",
      render: (text, record) => {
        return (
          <div key={`${text}-action`} style={{ width: 120 }}>
            <Button
              key={`${text}-view`}
              type="text"
              onClick={() => {
                handleViewSituationItem(record.relation_id, record.set_type);
              }}
              className="table-content"
            >
              <img
                alt="view"
                src={ViewIcon}
                className="table-content-icon"
                style={{ opacity: 0.6 }}
              />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {isModalOpen && (
        <div>
          <Modal
            width={1080}
            className="audio-situation-content-modal audio-modal-close-x"
            open={isModalOpen}
            onCancel={() => {
              setIsModalOpen(false);
            }}
            footer={
              <Button
                type="text"
                onClick={() => setIsModalOpen(false)}
                className="situation-finish-btn"
              >
                <span className="situation-finish-btn-text">
                  <FormattedMessage {...Messages.Text_Button_Close} />
                </span>
              </Button>
            }
          >
            <div className="situation-detail">
              <div className="situation-title-row">
                <div className="situation-card-title">
                  <FormattedMessage {...Messages.Text_Audio_AudioName} />
                  {`: ${viewSituation?.name}`}
                </div>
              </div>
              <div className="situation-description">
                <FormattedMessage {...Messages.Text_Common_Description} />
                {`: ${viewSituation?.remark}`}
              </div>
              <div>
                <Table
                  className="audio-situation-detail-table"
                  columns={detailColumns}
                  dataSource={viewSituationItems}
                  size={"small"}
                  pagination={false}
                  rowKey={(record) => record.orderNum}
                  scroll={{ x: "max-content", y: height - 420 }}
                />
              </div>
            </div>
          </Modal>
          {isAudioViewModalOpen === true &&
            choosedSituationItemId !== undefined && (
              <AudioViewModal
                situationDetailId={choosedSituationItemId}
                isModalOpen={isAudioViewModalOpen}
                setIsModalOpen={setIsAudioViewModalOpen}
                type={linkType}
              />
            )}
        </div>
      )}
    </div>
  );
};
export default AudioMainViewModal;
