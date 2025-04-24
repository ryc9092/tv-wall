import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Col, Input, Row } from "antd";
import EncoderCard from "../components/tvwall/encoderCard";
import { SearchOutlined } from "@ant-design/icons";
import {
  createDeviceLink,
  removeDeviceLink,
  getDeviceLinks,
  getFilteredDecoders,
  getEncoders,
} from "../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import ScreenBackgroundImage from "../assets/screenBackground.png";
import ClearLinkIcon from "../assets/clearLink.png";
import ClearLinkDisabledIcon from "../assets/clearLinkDisabled.png";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
  sleep,
} from "../utils/Utils";
import "../App.scss";
import "./SingleScreen.scss";

import useWindowDimensions from "../utils/WindowDimension";

const SingleScreen = () => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const { width } = useWindowDimensions();
  const [decoders, setDecoders] = useState([]);
  const [searchDecoderFilter, setSearchDecoderFilter] = useState("");
  const [filteredDecoders, setFilteredDecoders] = useState([]);
  const [decoderCards, setDecoderCards] = useState(null);
  const [encoders, setEncoders] = useState([]);
  const [selectedEncoder, setSelectedEncoder] = useState({
    nickName: "",
    mac: "",
    previewUrl: "",
  });
  const [reload, setReload] = useState(null);

  // set encoder, decoder
  useEffect(() => {
    (async () => {
      const encoders = await getEncoders(store);
      const decoders = await getFilteredDecoders(store);
      const deviceLinks = await getDeviceLinks({
        store: store,
        linkType: "video",
        isPreset: "N",
      });

      // set linked decoders list
      let linkedDecoders = [];
      if (deviceLinks && deviceLinks.length >= 0) {
        deviceLinks.forEach((deviceLink) => {
          if (deviceLink.deviceLinkDetails.length >= 0) {
            deviceLink.deviceLinkDetails.forEach((deviceLinkDetail) => {
              const decoderMac = deviceLinkDetail.decoder;
              linkedDecoders.push(decoderMac);
            });
          }
        });
      }

      let tempDecoders = []; // for set decoders
      decoders?.forEach((decoder) => {
        if (linkedDecoders.includes(decoder.mac)) {
          deviceLinks?.forEach((deviceLink) => {
            const encoderMac = deviceLink.encoder;
            if (deviceLink.deviceLinkDetails.length >= 0) {
              deviceLink.deviceLinkDetails.forEach((deviceLinkDetail) => {
                const decoderMac = deviceLinkDetail.decoder;
                encoders?.forEach((encoder) => {
                  if (
                    encoder.mac === encoderMac &&
                    decoder.mac === decoderMac
                  ) {
                    tempDecoders.push({
                      ...decoder,
                      encoder: {
                        mac: encoder.mac,
                        nickName: encoder.nickName,
                      },
                    });
                  }
                });
              });
            }
          });
        } else {
          tempDecoders.push({
            ...decoder,
            encoder: {
              mac: "",
              nickName: "",
            },
          });
        }
      });
      setEncoders(encoders);
      setDecoders(tempDecoders.length > 0 ? tempDecoders : decoders);
    })();
  }, [reload, store]);

  // filtered decoder list
  useEffect(() => {
    (async () => {
      let tempFilteredDecoders = [];
      decoders?.forEach((decoder) => {
        if (decoder.nickName.includes(searchDecoderFilter))
          tempFilteredDecoders.push(decoder);
      });
      setFilteredDecoders(tempFilteredDecoders);
    })();
  }, [decoders, searchDecoderFilter]);

  const handleClearScreen = async (event) => {
    const decoderMac = event.target.id.split("@")[1];
    let tempDecoders = decoders;
    tempDecoders?.forEach(async (decoder) => {
      if (decoder.mac === decoderMac && decoder.encoder !== "") {
        const result = await removeDeviceLink({
          store: store,
          linkType: `video`,
          encoder: decoder.encoder,
          decoders: [decoder.mac],
        });
        if (result) {
          showSuccessNotificationByMsg(
            intl.formatMessage(Messages.Text_SingleScreen_VideoClearSuccess)
          );
        } else {
          showWarningNotification(
            intl.formatMessage(Messages.Text_SingleScreen_VideoClearFail)
          );
        }
      }
    });
    setDecoders(tempDecoders);
    setReload(Math.random());
  };

  const [selectedScreen, setSelectedScreen] = useState(null);
  useEffect(() => {
    let tempDecoderCards = [];
    filteredDecoders?.forEach((decoder) => {
      tempDecoderCards.push(
        <Col key={`col@${decoder.mac}`} id={`card@${decoder.mac}`}>
          <div
            id={`card@${decoder.mac}`}
            className="single-screen-card-outer"
            style={
              decoder.encoder.mac
                ? { backgroundImage: `url(${ScreenBackgroundImage}` }
                : null
            }
            onClick={(event) => {
              if (!event.target.id.includes("btn") && decoder.state === "Up") {
                const decoderMac = event.target.id.split("@")[1];
                // already selected, unselected it
                if (selectedScreen === decoderMac) setSelectedScreen(null);
                else setSelectedScreen(decoderMac);
              }
            }}
          >
            <div
              id={`card@${decoder.mac}`}
              className={
                selectedScreen === decoder.mac
                  ? "single-screen-card-selected"
                  : decoder.encoder.mac
                  ? "single-screen-card-with-source"
                  : "single-screen-card"
              }
            >
              <div
                id={`card@${decoder.mac}`}
                className="single-screen-card-title-row"
              >
                <span
                  id={`card@${decoder.mac}`}
                  className={
                    selectedScreen === decoder.mac
                      ? "single-screen-card-title-selected"
                      : "single-screen-card-title"
                  }
                  style={decoder.state !== "Up" ? { color: "#c33434" } : null}
                >
                  {decoder.nickName.length > 10
                    ? decoder.nickName.substring(0, 10) + "..."
                    : decoder.nickName}
                </span>
              </div>
              <div id={`card@${decoder.mac}`}>
                <div
                  id={`card@${decoder.mac}`}
                  className={
                    selectedScreen === decoder.mac
                      ? "single-screen-card-desc-selected"
                      : "single-screen-card-desc"
                  }
                >
                  <FormattedMessage {...Messages.Text_TVWall_VideoSource} />
                  {" : "}{" "}
                  {decoder.encoder?.nickName
                    ? decoder.encoder?.nickName
                    : intl.formatMessage(Messages.Text_Common_None)}
                </div>
                <div
                  id={`card@${decoder.mac}`}
                  className="single-screen-btn-position"
                >
                  {decoder.encoder.mac ? (
                    <Button
                      id={`btn@${decoder.mac}`}
                      type="primary"
                      style={{
                        color: "#e7e7e7",
                        backgroundColor: "#262320",
                        position: "absolute",
                        borderRadius: "20px",
                        zIndex: 100,
                      }}
                      onClick={(event) => handleClearScreen(event)}
                    >
                      <div style={{ display: "flex" }}>
                        <img
                          id={`btn@${decoder.mac}`}
                          alt="clear link"
                          src={ClearLinkIcon}
                          style={{
                            width: 18,
                            height: 18,
                            marginTop: 2,
                            marginRight: 6,
                          }}
                        />
                        <span
                          id={`btn@${decoder.mac}`}
                          className="single-screen-btn-text"
                        >
                          <FormattedMessage
                            {...Messages.Text_Button_ClearSource}
                          />
                        </span>
                      </div>
                    </Button>
                  ) : (
                    <Button
                      id={`btn@${decoder.mac}`}
                      type="primary"
                      disabled
                      style={{
                        color: "#a5a5a5",
                        backgroundColor: "#c6c6c6",
                        position: "absolute",
                        borderRadius: "20px",
                        zIndex: 100,
                      }}
                    >
                      <div style={{ display: "flex" }}>
                        <img
                          id={`btn@${decoder.mac}`}
                          alt="clear link"
                          src={ClearLinkDisabledIcon}
                          style={{
                            width: 18,
                            height: 18,
                            marginTop: 2,
                            marginRight: 6,
                          }}
                        />
                        <span
                          id={`btn@${decoder.mac}`}
                          className="single-screen-btn-text"
                        >
                          <FormattedMessage
                            {...Messages.Text_Button_ClearSource}
                          />
                        </span>
                      </div>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Col>
      );
    });
    setDecoderCards(tempDecoderCards);
  }, [selectedScreen, filteredDecoders, selectedEncoder, store.siderCollapse]);

  useEffect(() => {
    const handleLinkScreen = (decoderMac, encoderMac) => {
      createDeviceLink({
        store: store,
        id: `video.${decoderMac}`,
        linkType: "video",
        encoder: encoderMac,
        decoders: [decoderMac],
        value1: "",
        remark: "",
        isPreset: "N",
      }).then((result) => {
        if (result) {
          showSuccessNotificationByMsg(
            intl.formatMessage(Messages.Text_SingleScreen_VideoPlaySuccess)
          );
        } else {
          showWarningNotification(
            intl.formatMessage(Messages.Text_SingleScreen_VideoPlayFail)
          );
        }
        setSelectedScreen(null);
        setSelectedEncoder({
          nickName: "",
          mac: "",
          previewUrl: "",
        });
        sleep(800).then(() => {
          setReload(Math.random());
        });
      });
    };
    if (selectedScreen && selectedEncoder.mac) {
      handleLinkScreen(selectedScreen, selectedEncoder.mac);
    }
  }, [selectedScreen, selectedEncoder, store, intl]);

  return (
    <div className="page-layout-column">
      <div>
        <div
          className={
            store.siderCollapse
              ? "single-screen-title-row-collapse"
              : "single-screen-title-row"
          }
        >
          <span className="page-title">
            <FormattedMessage {...Messages.Text_SingleScreen_Management} />
          </span>
        </div>
        <div
          className={
            store.siderCollapse
              ? "single-screen-title-row-collapse"
              : "single-screen-title-row"
          }
          style={{ marginTop: "16px" }}
        >
          <Input
            className="single-screen-title-input singlescreen-input"
            variant="filled"
            onChange={(e) => {
              setSearchDecoderFilter(e.target.value);
            }}
            prefix={<SearchOutlined />}
            placeholder={intl.formatMessage(
              Messages.Text_SingleScreen_InputDecoder
            )}
          />
        </div>
        <Row
          className="single-screen-left-container"
          style={
            store.siderCollapse
              ? {
                  width: width - 431,
                }
              : {
                  width: width - 600,
                }
          }
          gutter={[6, 6]}
        >
          {decoderCards}
        </Row>
      </div>
      <EncoderCard
        encoders={encoders}
        selectedEncoder={selectedEncoder}
        setSelectedEncoder={setSelectedEncoder}
      />
    </div>
  );
};

export default SingleScreen;
