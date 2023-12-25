import { useEffect, useState } from "react";
import { Button, Col, Input, InputNumber, Modal, Row } from "antd";
import { blockColorList } from "../../../utils/Constant";
import "../../../App.scss";

const ViewTemplate = ({ template, modalOpen, setModalOpen }) => {
  const [templateName, setTemplateName] = useState(null);
  const [templateSize, setTemplateSize] = useState({ col: 1, row: 1 });
  const [screenList, setScreenList] = useState([]);
  const [wallTemplate, setWallTemplate] = useState(null);

  useEffect(() => {
    if (template && modalOpen) {
      setScreenList(template.screens);
      setTemplateSize(template.dimension);
      setTemplateName(template.name);
    }
  }, [template, modalOpen]);

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
          <Button
            style={{
              width: "42px",
              height: "42px",
              border: "0px",
              backgroundColor: blockColorList[screen.block - 1],
            }}
            key={screen.number}
            value={screen.number}
          >
            {screen.number}
          </Button>
        </td>
      );
      if (tempRow.length === templateSize.col) {
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
        width={428}
        open={modalOpen}
        footer={null}
        onCancel={() => {
          modalOpen = false;
          setModalOpen(false);
        }}
      >
        <Row style={{ marginTop: "20px" }}>
          <Col style={{ marginRight: "4px" }}>{"版型名稱:"}</Col>
          <Col style={{ marginRight: "16px" }}>
            <Input
              value={templateName}
              size="small"
              style={{ width: "120px" }}
              disabled
            />
          </Col>
        </Row>
        <Row style={{ marginTop: "12px" }}>
          <Col style={{ marginRight: "32px" }}>{"維度:"}</Col>
          <Col style={{ marginRight: "6px" }}>
            <InputNumber
              value={templateSize.col}
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
              value={templateSize.row}
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
        </Row>
      </Modal>
    </div>
  );
};

export default ViewTemplate;
