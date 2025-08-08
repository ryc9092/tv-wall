import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../store/store";
import { SearchOutlined } from "@ant-design/icons";
import { Actions } from "../store/reducer";
import { Button, Col, Input, InputNumber, Row, Slider } from "antd";
import { getVolumeData, postVolumeData } from "../../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../messages";
import Speacker from "../../assets/speaker.png";
import SpeackerOff from "../../assets/speaker-off.png";
import "../../App.scss";
import "./volume.scss";

import useWindowDimensions from "../../utils/WindowDimension";

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

const VolumeSetting = () => {
  const intl = useIntl();
  const { width, height } = useWindowDimensions();
  const [store, dispatch] = useContext(StoreContext);
  const [reload, setReload] = useState(null);
  const [volumeData, setVolumeData] = useState([]);
  const [volumeCards, setVolumeCards] = useState([]);

  useEffect(() => {
    (async () => {
      // const volumeData = await getVolumeData(store);
      const volumeData = [
        {
          deviceType: "p300",
          id: "11",
          volume: 10,
          mute: "ON",
          name: "Analog input 1",
          maxVolume: 100,
          minVolume: 0,
        },
        {
          deviceType: "p300",
          id: "11-1",
          volume: 10,
          mute: "OFF",
          name: "Analog input 1-1",
          maxVolume: 100,
          minVolume: 0,
        },
      ];
      console.log("Volume Data: ", volumeData);
      setVolumeData(volumeData);
    })();
  }, [store]);

  const handleClickSpeacker = async (volumeID) => {
    // const result = await postVolumeData(store, volume);
    // if (result) {
    let newVolumeData = volumeData.map((vol) => {
      if (vol.id === volumeID) {
        return {
          ...vol,
          ...{ mute: vol.mute === "ON" ? "OFF" : "ON" },
        };
      }
      return vol;
    });
    setVolumeData(newVolumeData);
    setReload(new Date().getTime());
    // }
  };

  const handleVolumeChange = async (volume) => {
    // const result = await postVolumeData(store, volume);
    // if (result) {
    let newVolumeData = volumeData.map((vol) => {
      if (vol.id === volume.id) {
        return {
          ...vol,
          ...volume,
        };
      }
      return vol;
    });
    setVolumeData(newVolumeData);
    setReload(new Date().getTime());
    // }
  };

  useEffect(() => {
    let tempVolumeCards = [];
    volumeData?.forEach((volume) => {
      let volumeCard = (
        <Col>
          <div className="volume-card">
            <div className="volume-card-title">
              {truncateText(volume.name, 9)}
            </div>
            <div className="volume-card-devicetype">
              {truncateText(volume.deviceType, 9)}
            </div>
            {volume.mute === "ON" ? (
              <div
                id={`speacker@${volume.id}`}
                style={{
                  height: 45,
                  width: 45,
                  borderRadius: 24,
                  backgroundColor: "#fbf37b",
                  cursor: "pointer",
                  alignContent: "center",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                onClick={(event) => {
                  const volumeID = event.target.id.split("@")[1];
                  handleClickSpeacker(volumeID);
                }}
              >
                <img
                  id={`speackerimg@${volume.id}`}
                  alt="speacker"
                  src={Speacker}
                  style={{ width: 20, marginTop: 3 }}
                />
              </div>
            ) : (
              <div
                id={`speackeroff@${volume.id}`}
                style={{
                  height: 45,
                  width: 45,
                  borderRadius: 24,
                  border: "1px solid #575452",
                  cursor: "pointer",
                  alignContent: "center",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                onClick={(event) => {
                  const volumeID = event.target.id.split("@")[1];
                  handleClickSpeacker(volumeID);
                }}
              >
                <img
                  id={`speackeroffimg@${volume.id}`}
                  alt="speacker"
                  src={SpeackerOff}
                  style={{ width: 20, marginTop: 3 }}
                />
              </div>
            )}
            <div
              className="volume-card-text"
              style={{ marginTop: 14, marginBottom: 12 }}
            >
              {volume.maxVolume}
            </div>
            <div style={{ height: 200 }}>
              <Slider
                key={volume.id + `${volume.volume}`}
                className="volume-slider-track volume-slider-rail volume-slider-handle volume-slider-handle-after volume-slider-handle-tooltip-after volume-slider-handle-hover-after volume-slider-handle-focus-after h h1 h2"
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                max={volume.maxVolume}
                min={volume.minVolume}
                vertical
                defaultValue={volume.volume}
                onChangeComplete={(value) =>
                  handleVolumeChange({
                    volume: value,
                    id: volume.id,
                    deviceType: volume.deviceType,
                    mute: volume.mute,
                  })
                }
              />
            </div>
            <div
              className="volume-card-text"
              style={{ marginTop: 12, marginBottom: 14 }}
            >
              {volume.minVolume}
            </div>
            <InputNumber
              min={0}
              max={100}
              step="0.1"
              size="large"
              value={volume.volume}
              style={{ width: 68 }}
              onChange={(value) =>
                handleVolumeChange({
                  volume: value,
                  id: volume.id,
                  deviceType: volume.deviceType,
                  mute: volume.mute,
                })
              }
            />
          </div>
        </Col>
      );
      tempVolumeCards.push(volumeCard);
    });

    setVolumeCards(tempVolumeCards);
  }, [volumeData, reload]);

  return (
    <div className="page-layout-column">
      <div>
        <div className="volume-title-row">
          <div className="page-title">
            <FormattedMessage {...Messages.Text_Audio_VolumeSetting} />
          </div>
          <div style={{ marginTop: "-3px" }}>
            <Input
              className="volume-title-input volume-input"
              variant="filled"
              prefix={<SearchOutlined />}
              placeholder={intl.formatMessage(
                Messages.Text_DeviceStatus_InputDeviceName
              )}
            />
          </div>
        </div>
        <div
          className={
            store.siderCollapse
              ? "volume-container-collapse"
              : "volume-container"
          }
        >
          <Row>{volumeCards}</Row>
        </div>
      </div>
    </div>
  );
};

export default VolumeSetting;
