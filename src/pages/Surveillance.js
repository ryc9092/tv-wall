import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Col, Modal, Row } from "antd";
import { getStreams } from "../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import "../App.scss";
import "./Surveillance.scss";

const Surveillance = () => {
  const [store] = useContext(StoreContext);
  const [streamCards, setStreamCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStream, setSelectedStream] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await getStreams(store);
      const streamList = result?.Urls;
      if (streamList) {
        let tempStreamCards = [];
        streamList?.forEach((stream) => {
          let streamCard = (
            <Col key={stream} className="surveillance-stream-card">
              <div
                className="surveillance-stream-cover"
                onClick={() => {
                  setIsModalOpen(true);
                  setSelectedStream(stream);
                }}
              >
                <span className="surveillance-stream-cover-text">
                  <FormattedMessage {...Messages.Text_TVWall_VideoSource} />
                  {" : "}
                  {stream}
                </span>
              </div>
              <iframe
                src={stream}
                title="Video player"
                className="surveillance-stream-card"
              />
            </Col>
          );
          tempStreamCards.push(streamCard);
        });
        setStreamCards(tempStreamCards);
      }
    })();
  }, []);

  return (
    <div className="surveillance-layout">
      <div>
        <span className="page-title">
          <FormattedMessage {...Messages.Text_Surveillance_Title} />
        </span>
      </div>
      <div className="surveillance-container">
        <Row gutter={0}>{streamCards}</Row>
      </div>
      <Modal
        className="surveillance-modal"
        width={1200}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <iframe
          src={selectedStream}
          title="Video player"
          className="surveillance-modal-stream-iframe"
        />
      </Modal>
    </div>
  );
};

export default Surveillance;
