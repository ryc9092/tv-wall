import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../store/store";
import { SearchOutlined } from "@ant-design/icons";
import { Actions } from "../store/reducer";
import { Button, Col, Input, Row, Slider } from "antd";
import {
  getWalls,
  deleteWall,
  getWallScreensById,
  geVolumeData,
} from "../../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../messages";
import TrashIcon from "../../assets/trash.png";
import SearchIcon from "../../assets/magnifying-glass.png";
import "../../App.scss";
import "./volume.scss";

import useWindowDimensions from "../../utils/WindowDimension";


const VolumeSetting = () => {
  const intl = useIntl();
  const { width, height } = useWindowDimensions();
  const [store, dispatch] = useContext(StoreContext);
  const [walls, setWalls] = useState([]);
  const [reload, setReload] = useState(null);
  const [volumeData, setVolumeData] = useState([]);
  const [volumeCards, setVolumeCards] = useState([]);

  useEffect(() => {
    (async () => {
      const volumeData = await geVolumeData(store);
      console.log("Volume Data: ", volumeData);
      setVolumeData(volumeData);
    })();
  }, [reload, store]);

  useEffect(() => {
    let tempVolumeCards = [];
    volumeData?.forEach((volume) => {
      //   let volumeCard = {
      //     key: volume.id,
      //     name: volume.name,
      //     volume: volume.volume,
      //     mute: volume.mute ? "Yes" : "No",
      //   };
      let volumeCard = (
        <Col>
          <div className="volume-card">
            <div style={{ height: 48 }}>{volume.name}</div>
            <div style={{ height: 310 }}>
              <Slider
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                vertical
                defaultValue={30}
              />
            </div>
          </div>
        </Col>
      );
      tempVolumeCards.push(volumeCard);
      tempVolumeCards.push(volumeCard);
    });

    setVolumeCards(tempVolumeCards);
  }, [volumeData]);

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
