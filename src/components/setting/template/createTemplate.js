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
  Tooltip,
  Typography,
} from "antd";
import { blockColorList } from "../../../utils/Constant";
import { createTemplate } from "../../../api/API";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
} from "../../../utils/Utils";
import "../../../App.scss";

const CreateTemplate = ({ setReload }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState(null);
  const [templateSize, setTemplateSize] = useState({ col: 1, row: 1 });
  const [screenList, setScreenList] = useState([]);
  const [wallTemplate, setWallTemplate] = useState(null);
  const [blocks, setBlocks] = useState(1);
  const [currentBlock, setCurrentBlock] = useState(1);

  const resetTemplate = () => {
    setScreenList([]);
    setTemplateName(null);
    setTemplateSize({ col: 1, row: 1 });
    setBlocks(1);
    setCurrentBlock(1);
  };

  useEffect(() => {
    resetTemplate();
  }, [isModalOpen]);

  // initialize screen list by dimension: [{number: 1, block: ""}, {number: 2, block: ""}, ...]
  useEffect(() => {
    setScreenList(
      Array.from({ length: templateSize.col * templateSize.row }, (v, i) => {
        return { number: i + 1, block: "" };
      })
    );
  }, [templateSize]);

  // initialize block radios by block number:
  const blockNum = Array.from({ length: blocks }, (v, i) => i + 1); // make a block list [1, 2, 3, ...]
  let blockRadios = (
    <>
      {blockNum.map((block) => {
        return (
          <Radio
            key={block}
            value={block}
            style={{
              margin: "4px",
              backgroundColor: blockColorList[block - 1],
              borderRadius: "6px",
            }}
          >
            區塊 {block}
          </Radio>
        );
      })}
    </>
  );

  useEffect(() => {
    // create template table
    let tempRow = [];
    let tempTemplate = [];
    screenList.forEach((screen) => {
      tempRow.push(
        <td
          style={{ width: "40px", height: "40px", textAlign: "center" }}
          key={screen.number}
        >
          <Tooltip placement="topLeft" title={screen.decoder}>
            <Button
              style={{
                width: "42px",
                height: "42px",
                border: "0px",
                backgroundColor: blockColorList[screen.block - 1],
              }}
              key={screen.number}
              value={screen.number}
              onClick={(e) => {
                clickWallScreen(e.target.value);
              }}
            >
              {screen.number}
            </Button>
          </Tooltip>
        </td>
      );
      if (tempRow.length === templateSize.col) {
        tempTemplate.push(<tr key={screen.number}>{tempRow}</tr>);
        tempRow = []; // clear row
      }
    });
    setWallTemplate(tempTemplate);
  }, [screenList, currentBlock]);

  // set block number to clicked screen
  const clickWallScreen = (number) => {
    let tempScreenList = [...screenList];
    tempScreenList[number - 1].block = currentBlock;
    setScreenList(tempScreenList);
  };

  const saveWall = () => {
    console.log(
      `template name: ${templateName}, template size: ${JSON.stringify(
        templateSize
      )}, screen list: ${JSON.stringify(screenList)}`
    );
    (async () => {
      const result = await createTemplate();
      if (result) {
        showSuccessNotificationByMsg("版型建立成功");
        setReload(Math.random);
        setIsModalOpen(false);
      } else showWarningNotification("版型建立失敗");
    })();
  };

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>
        <Typography.Text>建立新版型</Typography.Text>
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
          <Col style={{ marginRight: "6px" }}>{"維度:"}</Col>
          <Col style={{ marginRight: "6px" }}>
            <InputNumber
              value={templateSize.col}
              min={1}
              max={6}
              size="small"
              style={{ width: "48px" }}
              onChange={(value) =>
                setTemplateSize({ ...templateSize, col: value })
              }
            />
          </Col>
          <Col style={{ marginRight: "6px" }}>{" X "}</Col>
          <Col>
            <InputNumber
              value={templateSize.row}
              min={1}
              max={6}
              size="small"
              style={{ width: "48px" }}
              onChange={(value) =>
                setTemplateSize({ ...templateSize, row: value })
              }
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
                <tbody>{wallTemplate}</tbody>
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
              <Radio.Group
                value={currentBlock}
                onChange={(e) => {
                  setCurrentBlock(e.target.value);
                }}
              >
                <Space direction="vertical">{blockRadios}</Space>
              </Radio.Group>
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: "16px" }}>
          <Button onClick={resetTemplate} style={{ marginRight: "16px" }}>
            重置版型
          </Button>
          <Button onClick={saveWall}>儲存</Button>
        </Row>
      </Modal>
    </div>
  );
};

export default CreateTemplate;
