import React, { useContext, useEffect, useState } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
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
  const [selectedStream, setSelectedStream] = useState({});

  useEffect(() => {
    (async () => {
      const result = await getStreams(store);
      const streamList = result?.RtElement;
      if (streamList) {
        let tempStreamCards = [];
        streamList?.forEach((stream) => {
          let streamCard = (
            <Col key={stream.Name} className="surveillance-stream-card">
              <div
                className="surveillance-stream-cover"
                onClick={() => {
                  setSelectedStream(stream);
                  const modal =
                    document.getElementsByClassName("surveillance-modal");
                  if (modal) {
                    const iframe = document.getElementsByClassName(
                      "surveillance-modal-stream-iframe"
                    );
                    iframe[0]?.setAttribute("src", stream.Url);
                  }
                  setIsModalOpen(true);
                }}
              >
                <span className="surveillance-stream-cover-text">
                  {stream.Name}
                </span>
                <span className="surveillance-stream-cover-text">
                  {stream.Ip}
                </span>
              </div>
              <div>
                <PlayCircleOutlined className="surveillance-stream-play-icon"/>
              </div>
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
        width={1180}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setSelectedStream({});
          const iframe = document.getElementsByClassName(
            "surveillance-modal-stream-iframe"
          );
          iframe[0].src = "";
          setIsModalOpen(false);
        }}
      >
        <iframe
          src={selectedStream.Url}
          title="Video player"
          className="surveillance-modal-stream-iframe"
        />
      </Modal>
    </div>
  );
};

export default Surveillance;
