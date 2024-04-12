import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../../components/store/store";
import { Col, Input, InputNumber, Modal, Row, Select, Typography } from "antd";
import { getWallScreensById } from "../../../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../../messages";
import "../../../App.scss";

const ViewWall = ({ wall, modalOpen, setModalOpen }) => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [wallName, setWallName] = useState(null);
  const [wallSize, setWallSize] = useState({ col: 1, row: 1 });
  const [screenList, setScreenList] = useState([]);
  const [wallObj, setWallObj] = useState(null);

  useEffect(() => {
    if (wall) {
      (async () => {
        const screens = await getWallScreensById(store, wall.wallId);
        setScreenList(screens);
        setWallSize({ col: wall.col, row: wall.row });
        setWallName(wall.wallName);
      })();
    }
  }, [wall]);

  useEffect(() => {
    setModalOpen(modalOpen);
  }, [modalOpen, setModalOpen]);

  useEffect(() => {
    // create wall table
    let tempRow = [];
    let tempWall = [];
    screenList.forEach((screen) => {
      tempRow.push(
        <td
          style={{ width: "40px", height: "40px", textAlign: "center" }}
          key={screen.num}
        >
          {screen.num}
        </td>
      );
      if (tempRow.length === wallSize.col) {
        tempWall.push(<tr key={screen.num}>{tempRow}</tr>);
        tempRow = []; // clear row
      }
    });
    setWallObj(tempWall);
  }, [screenList]);

  return (
    <div>
      <Modal
        title={intl.formatMessage(Messages.Text_WallSetting_Wall)}
        className="modal-title"
        width={568}
        open={modalOpen}
        footer={null}
        onCancel={() => {
          modalOpen = false;
          setModalOpen(false);
        }}
      >
        <Row style={{ marginTop: "20px" }}>
          <Col style={{ marginRight: "6px" }}>
            <FormattedMessage {...Messages.Text_WallSetting_WallName} />
            {":"}
          </Col>
          <Col style={{ marginRight: "16px" }}>
            <Input
              value={wallName}
              size="small"
              style={{ width: "120px" }}
              disabled
            />
          </Col>
          <Col style={{ marginRight: "6px" }}>
            <FormattedMessage {...Messages.Text_Common_Dimension} />
            {":"}
          </Col>
          <Col style={{ marginRight: "6px" }}>
            <InputNumber
              value={wallSize.col}
              min={1}
              max={6}
              size="small"
              style={{ width: "48px" }}
              disabled
            ></InputNumber>
          </Col>
          <Col style={{ marginRight: "6px" }}>{" X "}</Col>
          <Col>
            <InputNumber
              value={wallSize.row}
              min={1}
              max={6}
              size="small"
              style={{ width: "48px" }}
              disabled
            ></InputNumber>
          </Col>
        </Row>
        <Row style={{ marginTop: "16px" }}>
          <Col style={{ marginRight: "12px" }}>
            <div style={{ marginBottom: "2px" }}>
              <FormattedMessage {...Messages.Text_WallSetting_ScreenNumber} />
            </div>
            <div
              style={{
                width: "279px",
                height: "279px",
                border: "1px solid black",
              }}
            >
              <table>
                <tbody>{wallObj}</tbody>
              </table>
            </div>
          </Col>
          <Col>
            <div style={{ marginBottom: "2px" }}>
              <FormattedMessage
                {...Messages.Text_WallSetting_ScreenDecoderPair}
              />
            </div>
            <div
              style={{
                width: "225px",
                height: "279px",
                border: "1px solid black",
                overflowY: "scroll",
              }}
            >
              {screenList.map((screen, index) => {
                return (
                  <Row key={screen.num}>
                    <Typography.Text
                      style={{ fontSize: "14px", margin: "4px" }}
                    >
                      <FormattedMessage {...Messages.Text_Common_Screen} />
                      {screen.num}:
                    </Typography.Text>
                    <Select
                      size="small"
                      value={screen.nickName}
                      style={{ width: "135px", margin: "4px 4px 4px 8px" }}
                      disabled
                    />
                  </Row>
                );
              })}
            </div>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default ViewWall;
