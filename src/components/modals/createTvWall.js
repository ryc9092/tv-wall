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
import { EditOutlined } from "@ant-design/icons";
import { FAKE_DECODERS } from "../../utils/Constant";
import "./createTvWall.scss";
import "../../App.scss";

const CreateTvWall = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tvWallName, setTvWallName] = useState(null);
  const [tvWallSize, setTvWallSize] = useState({ col: 1, row: 1 });
  const [screenList, setScreenList] = useState([]);
  const [tvWallTemplate, setTvWallTemplate] = useState(null);

  let decoderOptions = [];
  FAKE_DECODERS.forEach((decoder) => {
    decoderOptions.push({ value: decoder, label: decoder });
  });

  const resetTemplate = () => {
    setTvWallName(null);
    setTvWallSize({ col: 1, row: 1 });
    setScreenList([]);
  };

  useEffect(() => {
    resetTemplate();
  }, [isModalOpen]);

  useEffect(() => {
    // generate default screen list: [{number: 1, decoder: ""}, {number: 2, decoder: ""}, ...]
    setScreenList(
      Array.from({ length: tvWallSize.col * tvWallSize.row }, (v, i) => {
        return { number: i + 1, decoder: "", block: "" };
      })
    );
  }, [tvWallSize]);

  useEffect(() => {
    // create tv wall table
    let tvWallTempRow = [];
    let tvWallTemplate = [];
    screenList.forEach((screen) => {
      tvWallTempRow.push(
        <td
          style={{ width: "40px", height: "40px", textAlign: "center" }}
          key={screen.number}
        >
          {screen.number}
        </td>
      );
      if (tvWallTempRow.length === tvWallSize.col) {
        tvWallTemplate.push(<tr key={screen.number}>{tvWallTempRow}</tr>);
        tvWallTempRow = []; // clear row
      }
    });
    setTvWallTemplate(tvWallTemplate);
  }, [screenList]);

  const setScreenDecoder = ({ screenNumber, decoder }) => {
    let list = screenList;
    list[screenNumber - 1] = { number: screenNumber, decoder: decoder };
    setScreenList(screenList);
  };

  const saveTvWall = () => {
    console.log(screenList);
  };

  return (
    <div>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="setting-option-button"
      >
        <Typography.Text className="setting-option-text">
          建立電視牆
        </Typography.Text>
        <></>
        <EditOutlined className="setting-option-icon" />
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
              value={tvWallName}
              size="small"
              style={{ width: "120px" }}
              onChange={(e) => {
                setTvWallName(e.target.value);
              }}
            />
          </Col>
          <Col style={{ marginRight: "6px" }}>{"維度:"}</Col>
          <Col style={{ marginRight: "6px" }}>
            <InputNumber
              value={tvWallSize.col}
              min={1}
              max={6}
              size="small"
              style={{ width: "48px" }}
              onChange={(value) => setTvWallSize({ ...tvWallSize, col: value })}
            ></InputNumber>
          </Col>
          <Col style={{ marginRight: "6px" }}>{" X "}</Col>
          <Col>
            <InputNumber
              value={tvWallSize.row}
              min={1}
              max={6}
              size="small"
              style={{ width: "48px" }}
              onChange={(value) => setTvWallSize({ ...tvWallSize, row: value })}
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
                <tbody>{tvWallTemplate}</tbody>
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
          <Button onClick={saveTvWall}>儲存</Button>
        </Row>
      </Modal>
    </div>
  );
};

export default CreateTvWall;
