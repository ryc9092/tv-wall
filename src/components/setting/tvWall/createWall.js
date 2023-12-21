import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import { FAKE_DECODERS } from "../../../utils/Constant";
import "../../../App.scss";

const CreateWall = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wallName, setWallName] = useState(null);
  const [wallSize, setWallSize] = useState({ col: 1, row: 1 });
  const [screenList, setScreenList] = useState([]);
  const [wallTemplate, setWallTemplate] = useState(null);

  let decoderOptions = [];
  FAKE_DECODERS.forEach((decoder) => {
    decoderOptions.push({ value: decoder, label: decoder });
  });

  const resetTemplate = () => {
    setWallName(null);
    setWallSize({ col: 1, row: 1 });
    setScreenList([]);
  };

  useEffect(() => {
    resetTemplate();
  }, [isModalOpen]);

  useEffect(() => {
    // generate default screen list: [{number: 1, decoder: ""}, {number: 2, decoder: ""}, ...]
    setScreenList(
      Array.from({ length: wallSize.col * wallSize.row }, (v, i) => {
        return { number: i + 1, decoder: "", block: "" };
      })
    );
  }, [wallSize]);

  useEffect(() => {
    // create tv wall table
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

  const setScreenDecoder = ({ screenNumber, decoder }) => {
    let list = screenList;
    list[screenNumber - 1] = { number: screenNumber, decoder: decoder };
    setScreenList(screenList);
  };

  const saveWall = () => {
    console.log(screenList);
  };

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>
        <Typography.Text>建立電視牆</Typography.Text>
      </Button>
      <Modal
        title={"建立電視牆"}
        className="modal-title"
        width={568}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          resetTemplate();
          setIsModalOpen(false);
        }}
      >
        <Row style={{ marginTop: "20px" }}>
          <Col style={{ marginRight: "6px" }}>{"電視牆名稱:"}</Col>
          <Col style={{ marginRight: "16px" }}>
            <Input
              value={wallName}
              size="small"
              style={{ width: "120px" }}
              onChange={(e) => {
                setWallName(e.target.value);
              }}
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
              onChange={(value) => setWallSize({ ...wallSize, col: value })}
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
              onChange={(value) => setWallSize({ ...wallSize, row: value })}
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
                      options={decoderOptions}
                      size="small"
                      style={{ width: "135px", margin: "4px 4px 4px 8px" }}
                      onChange={(value, option) => {
                        setScreenDecoder({
                          screenNumber: screen.number,
                          decoder: value,
                        });
                      }}
                    />
                  </Row>
                );
              })}
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: "16px" }}>
          <Button onClick={resetTemplate} style={{ marginRight: "16px" }}>
            重置電視牆
          </Button>
          <Button onClick={saveWall}>儲存</Button>
        </Row>
      </Modal>
    </div>
  );
};

export default CreateWall;
