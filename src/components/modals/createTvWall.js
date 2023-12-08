import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Space,
  Typography,
} from "antd";
import { screenColorList } from "../../utils/Constant";
import { EditOutlined } from "@ant-design/icons";
import "./createTvWall.scss";
import "../../App.scss";

const CreateTvWall = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tvWallName, setTvWallName] = useState(null);
  const [tvWallSize, setTvWallSize] = useState({ col: 1, row: 1 });
  const [screens, setScreens] = useState(1);
  const [screenColor, setScreenColor] = useState("white");
  const [screenList, setScreenList] = useState([]);
  const [tvWallTemplate, setTvWallTemplate] = useState(null);
  const [updateFlag, setUpdateFlag] = useState(0);

  const resetTemplate = () => {
    setTvWallName(null);
    setTvWallSize({ col: 1, row: 1 });
    setScreens(1);
    setScreenList(
      Array.from({ length: 1 * 1 }, (v, i) => {
        return { number: i + 1, screen: "", color: "white" };
      })
    );
  };

  useEffect(() => {
    // generate default screen list: [{number: 1, screen: "", color: ""}, {number: 2, screen: "", color: ""}, ...]
    setScreenList(
      Array.from({ length: tvWallSize.col * tvWallSize.row }, (v, i) => {
        return { number: i + 1, screen: "", color: "white" };
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
          style={{
            width: "42px",
            height: "42px",
            backgroundColor: screen.color,
          }}
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
              clickTvWallScreen(e.target.value);
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
  }, [screenList, screenColor, updateFlag]);

  const clickTvWallScreen = (number) => {
    screenList[number - 1].color = screenColor;
    setScreenList(screenList);
    setUpdateFlag(updateFlag + 1);
  };

  const screenNum = Array.from({ length: screens }, (v, i) => i + 1); // make a screen list [1, 2, 3, ...]
  let screenRadios = (
    <>
      {screenNum.map((screen) => {
        return (
          <Radio
            key={screen}
            value={screen}
            style={{
              backgroundColor: screenColorList[screen - 1],
            }}
          >
            區塊 {screen}
          </Radio>
        );
      })}
    </>
  );

  return (
    <div>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="setting-option-button"
      >
        <Typography.Text className="setting-option-text">
          建立電視牆及版型
        </Typography.Text>
        <></>
        <EditOutlined className="setting-option-icon" />
      </Button>
      <Modal
        width={520}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          resetTemplate();
          setIsModalOpen(false);
        }}
      >
        <Row>
          <Col style={{ marginRight: "6px" }}>{"電視牆名稱:"}</Col>
          <Col style={{ marginRight: "12px" }}>
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
          <Col style={{ marginRight: "16px" }}>
            <Row style={{ marginBottom: "6px" }}>畫面編號</Row>
            <Row
              style={{
                border: "1px solid black",
                minWidth: "270px",
                minHeight: "260px",
              }}
            >
              <table>
                <tbody>{tvWallTemplate}</tbody>
              </table>
            </Row>
          </Col>
          <Col>
            <Row style={{ marginBottom: "6px" }}>解碼器對應</Row>
            <Row>
              <Radio.Group
                onChange={(e) => {
                  const value = e.target.value;
                  setScreenColor(screenColorList[value - 1]);
                }}
              >
                <Space direction="vertical">{screenRadios}</Space>
              </Radio.Group>
            </Row>
          </Col>
        </Row>
        <Row style={{ marginTop: "16px" }}>
          <Button onClick={resetTemplate}>重置電視牆</Button>
          <Button>儲存</Button>
        </Row>
      </Modal>
    </div>
  );
};

export default CreateTvWall;
