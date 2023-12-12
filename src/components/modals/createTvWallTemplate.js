import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Typography,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { FAKE_WALLS, screenColorList } from "../../utils/Constant";
import "./createTvWallTemplate.scss";
import "../../App.scss";

const CreateTvWallTemplate = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState(null);
  const [selectedWall, setSelectedWall] = useState(null);
  const [tvWallSize, setTvWallSize] = useState({ col: 1, row: 1 });
  const [screenList, setScreenList] = useState([]);
  const [tvWallTemplate, setTvWallTemplate] = useState(null);
  const [blocks, setBlocks] = useState(1);
  const [blockColor, setBlockColor] = useState("white");

  let tvWallOptions = [];
  FAKE_WALLS.forEach((wall) => {
    tvWallOptions.push({ value: wall.name, label: wall.name });
  });

  const blockNum = Array.from({ length: blocks }, (v, i) => i + 1); // make a block list [1, 2, 3, ...]
  let blockRadios = (
    <>
      {blockNum.map((block) => {
        return (
          <Radio
            key={block}
            value={block}
            style={{
              margin: "6px",
              backgroundColor: screenColorList[block - 1],
              borderRadius: "6px",
            }}
          >
            區塊 {block}
          </Radio>
        );
      })}
    </>
  );

  const resetTemplate = () => {
    setSelectedWall(null);
    setTvWallSize({ col: 1, row: 1 });
  };

  useEffect(() => {
    resetTemplate();
  }, [isModalOpen]);

  useEffect(() => {
    // generate default screen list: [{number: 1, decoder: ""}, {number: 2, decoder: ""}, ...]
    setScreenList(
      Array.from({ length: tvWallSize.col * tvWallSize.row }, (v, i) => {
        return { number: i + 1, decoder: "" };
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
          <Button
            style={{
              width: "42px",
              height: "42px",
              border: "0px",
              backgroundColor: screen.color,
            }}
            key={screen.number}
            value={screen.number}
            onClick={(e) => {
              // clickTvWallScreen(e.target.value);
            }}
          >
            {screen.number}
          </Button>
        </td>
      );
      if (tvWallTempRow.length === tvWallSize.col) {
        tvWallTemplate.push(<tr key={screen.number}>{tvWallTempRow}</tr>);
        tvWallTempRow = []; // clear row
      }
    });
    setTvWallTemplate(tvWallTemplate);
  }, [screenList]);

  const selectTvWall = (selectedWallName) => {
    FAKE_WALLS.forEach((wall) => {
      if (wall.name === selectedWallName) {
        setSelectedWall(wall.name);
        setTvWallSize(wall.dimension);
      }
    });
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
          建立電視牆版型
        </Typography.Text>
        <></>
        <EditOutlined className="setting-option-icon" />
      </Button>
      <Modal
        title={"建立電視牆版型"}
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
          <Col style={{ marginRight: "22px" }}>{"版型名稱:"}</Col>
          <Col style={{ marginRight: "16px" }}>
            <Input
              value={templateName}
              size="small"
              style={{ width: "120px" }}
              onChange={(e) => {
                setTemplateName(e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: "16px" }}>
          <Col>{"電視牆名稱:"}</Col>
          <Col style={{ marginRight: "16px" }}>
            <Select
              options={tvWallOptions}
              size="small"
              style={{ width: "135px", margin: "0px 4px 4px 8px" }}
              value={selectedWall}
              onChange={(value, option) => {
                console.log(value, option);
                selectTvWall(value);
              }}
            />
          </Col>
          <Col style={{ marginRight: "6px" }}>{"維度:"}</Col>
          <Col style={{ marginRight: "6px" }}>
            <InputNumber
              disabled
              value={tvWallSize.col}
              min={1}
              max={6}
              size="small"
              style={{ width: "48px" }}
            />
          </Col>
          <Col style={{ marginRight: "6px" }}>{" X "}</Col>
          <Col>
            <InputNumber
              disabled
              value={tvWallSize.row}
              min={1}
              max={6}
              size="small"
              style={{ width: "48px" }}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: "16px" }}>
          <Col style={{ marginRight: "12px" }}>
            <div style={{ marginBottom: "5px" }}>畫面編號</div>
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
            <Row style={{ marginBottom: "3px" }}>
              <div style={{ marginRight: "6px" }}>區塊</div>
              <div>
                <Button
                  size="small"
                  onClick={() => {
                    let blockNum = parseInt(blocks) + 1;
                    if (blockNum <= 7) setBlocks(blockNum);
                  }}
                >
                  新增區塊
                </Button>
              </div>{" "}
            </Row>
            <div
              style={{
                width: "225px",
                height: "279px",
                border: "1px solid black",
                overflowY: "scroll",
              }}
            >
              {blockRadios}
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: "16px" }}>
          <Button onClick={resetTemplate} style={{ marginRight: "16px" }}>
            重置版型
          </Button>
          <Button onClick={saveTvWall}>儲存</Button>
        </Row>
      </Modal>
    </div>
  );
};

export default CreateTvWallTemplate;
