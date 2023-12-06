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
} from "antd";
import { screenColorList } from "../../utils/Constant";
import "./tvWallTemplate.scss";

const TVWallTemplate = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tvWallName, setTvWallName] = useState(null);
  const [tvWallCol, setTvWallCol] = useState(1);
  const [tvWallRow, setTvWallRow] = useState(1);
  const [screens, setScreens] = useState(1);
  const [screenColor, setScreenColor] = useState("white");
  const [screenList, setScreenList] = useState([]);
  const [tvWallTemplate, setTvWallTemplate] = useState(null);
  const [updateFlag, setUpdateFlag] = useState(0);

  const resetTemplate = () => {
    setTvWallName(null);
    setTvWallCol(1);
    setTvWallRow(1);
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
      Array.from({ length: tvWallCol * tvWallRow }, (v, i) => {
        return { number: i + 1, screen: "", color: "white" };
      })
    );
  }, [tvWallCol, tvWallRow]);

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
      if (tvWallTempRow.length === tvWallCol) {
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
            畫面 {screen}
          </Radio>
        );
      })}
    </>
  );

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>建立牆面版型</Button>
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
          <Col style={{ marginRight: "6px" }}>{"牆面版型名稱:"}</Col>
          <Col>
            <Input
              value={tvWallName}
              size="small"
              onChange={(e) => {
                setTvWallName(e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: "16px" }}>
          <Col style={{ marginRight: "20px" }}>{"電視牆大小:"}</Col>
          <Col>
            <InputNumber
              value={tvWallCol}
              min={1}
              max={6}
              size="small"
              onChange={setTvWallCol}
            ></InputNumber>
          </Col>
          <Col>{" X "}</Col>
          <Col>
            <InputNumber
              value={tvWallRow}
              min={1}
              max={6}
              size="small"
              onChange={setTvWallRow}
            ></InputNumber>
          </Col>
        </Row>
        <Row style={{ marginTop: "16px" }}>
          <Col
            style={{
              border: "1px solid black",
              minWidth: "270px",
              minHeight: "260px",
              marginRight: "16px",
            }}
          >
            <table>
              <tbody>{tvWallTemplate}</tbody>
            </table>
          </Col>
          <Col>
            <Row style={{ marginBottom: "6px" }}>
              <Button
                onClick={() => {
                  let screenNum = parseInt(screens) + 1;
                  if (screenNum <= 7) setScreens(screenNum);
                }}
              >
                新增畫面
              </Button>
            </Row>
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
          <Button onClick={resetTemplate}>重置版型</Button>
          <Button>送出</Button>
        </Row>
      </Modal>
    </div>
  );
};

export default TVWallTemplate;
