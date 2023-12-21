import { useEffect, useState } from "react";
import { Col, Input, InputNumber, Modal, Row, Select, Typography } from "antd";
import { FAKE_DECODERS } from "../../../utils/Constant";
import "../../../App.scss";

const ViewWall = ({ wall, modalOpen, setModalOpen }) => {
  const [wallName, setWallName] = useState(null);
  const [wallSize, setWallSize] = useState({ col: 1, row: 1 });
  const [screenList, setScreenList] = useState([]);
  const [wallTemplate, setWallTemplate] = useState(null);

  useEffect(() => {
    if (wall) {
      setScreenList(wall.screens);
      setWallSize(wall.dimension);
      setWallName(wall.name);
    }
  }, [wall]);

  let decoderOptions = [];
  FAKE_DECODERS.forEach((decoder) => {
    decoderOptions.push({ value: decoder, label: decoder });
  });

  useEffect(() => {
    setModalOpen(modalOpen);
  }, [modalOpen, setModalOpen]);

  useEffect(() => {
    // create template table
    let tempRow = [];
    let template = [];
    screenList.forEach((screen) => {
      tempRow.push(
        <td
          style={{ width: "40px", height: "40px", textAlign: "center" }}
          key={screen.number}
        >
          {screen.number}
        </td>
      );
      if (tempRow.length === wallSize.col) {
        template.push(<tr key={screen.number}>{tempRow}</tr>);
        tempRow = []; // clear row
      }
    });
    setWallTemplate(template);
  }, [screenList]);

  return (
    <div>
      <Modal
        title={"版型"}
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
          <Col style={{ marginRight: "6px" }}>{"版型名稱:"}</Col>
          <Col style={{ marginRight: "16px" }}>
            <Input
              value={wallName}
              size="small"
              style={{ width: "120px" }}
              disabled
            />
          </Col>
          <Col style={{ marginRight: "6px" }}>{"維度:"}</Col>
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
            <div style={{ marginBottom: "2px" }}>畫面編號</div>
            <div
              style={{
                width: "279px",
                height: "279px",
                border: "1px solid black",
              }}
            >
              <table>
                <tbody>{wallTemplate}</tbody>
              </table>
            </div>
          </Col>
          <Col>
            <div style={{ marginBottom: "2px" }}>解碼器對應</div>
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
                  <Row key={screen.number}>
                    <Typography.Text
                      style={{ fontSize: "14px", margin: "4px" }}
                    >
                      畫面{screen.number}:
                    </Typography.Text>
                    <Select
                      size="small"
                      value={screen.decoder}
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
