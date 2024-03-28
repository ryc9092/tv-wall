import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../../components/store/store";
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
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../../messages";
import "../../../App.scss";

const CreateTemplate = ({ setReload }) => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateId, setTemplateId] = useState(null);
  const [templateName, setTemplateName] = useState(null);
  const [templateSize, setTemplateSize] = useState({ col: 1, row: 1 });
  const [screenList, setScreenList] = useState([]);
  const [wallTemplate, setWallTemplate] = useState(null);
  const [blocks, setBlocks] = useState(1);
  const [currentBlock, setCurrentBlock] = useState(1);

  const resetTemplate = () => {
    setTemplateId(null);
    setScreenList([]);
    setTemplateName(null);
    setTemplateSize({ col: 1, row: 1 });
    setBlocks(1);
    setCurrentBlock(1);
  };

  useEffect(() => {
    resetTemplate();
  }, [isModalOpen]);

  // initialize screen list by dimension: [{num: 1, block: ""}, {num: 2, block: ""}, ...]
  useEffect(() => {
    setScreenList(
      Array.from({ length: templateSize.col * templateSize.row }, (v, i) => {
        return { num: i + 1, block: "" };
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
            <FormattedMessage {...Messages.Text_Common_Block} /> {block}
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
          key={screen.num}
        >
          <Tooltip placement="topLeft" title={screen.decoder}>
            <Button
              style={{
                width: "42px",
                height: "42px",
                border: "0px",
                backgroundColor: blockColorList[screen.block - 1],
              }}
              key={screen.num}
              value={screen.num}
              onClick={(e) => {
                clickWallScreen(e.target.value);
              }}
            >
              {screen.num}
            </Button>
          </Tooltip>
        </td>
      );
      if (tempRow.length === templateSize.col) {
        tempTemplate.push(<tr key={screen.num}>{tempRow}</tr>);
        tempRow = []; // clear row
      }
    });
    setWallTemplate(tempTemplate);
  }, [screenList, currentBlock]);

  // set block number to clicked screen
  const clickWallScreen = (num) => {
    let tempScreenList = [...screenList];
    tempScreenList[num - 1].block = currentBlock;
    setScreenList(tempScreenList);
  };

  const saveWall = () => {
    (async () => {
      const result = await createTemplate(
        store,
        templateId,
        templateName,
        templateSize.col,
        templateSize.row,
        0,
        screenList
      );
      if (result) {
        showSuccessNotificationByMsg(
          intl.formatMessage(Messages.Text_TemplateSetting_CreateSuccess)
        );
        setReload(Math.random);
        setIsModalOpen(false);
      } else
        showWarningNotification(
          intl.formatMessage(Messages.Text_TemplateSetting_CreateFail)
        );
    })();
  };

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>
        <Typography.Text>
          <FormattedMessage {...Messages.Text_TemplateSetting_CreateTemplate} />
        </Typography.Text>
      </Button>
      <Modal
        title={intl.formatMessage(
          Messages.Text_TemplateSetting_CreateWallTemplate
        )}
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
          <Col style={{ marginRight: "22px" }}>
            <FormattedMessage {...Messages.Text_TemplateSetting_TemplateId} />
            {":"}
          </Col>
          <Col style={{ marginRight: "16px" }}>
            <Input
              value={templateId}
              size="small"
              style={{ width: "120px" }}
              onChange={(e) => {
                setTemplateId(e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: "16px" }}>
          <Col style={{ marginRight: "12px" }}>
            <FormattedMessage {...Messages.Text_TemplateSetting_TemplateName} />
            {":"}
          </Col>
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
          <Col style={{ marginRight: "40px" }}>
            <FormattedMessage {...Messages.Text_Common_Dimension} />
            {":"}
          </Col>
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
            <div style={{ marginBottom: "5px" }}>
              <FormattedMessage
                {...Messages.Text_TemplateSetting_ScreenNumber}
              />
            </div>
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
              <div style={{ marginRight: "6px" }}>
                <FormattedMessage {...Messages.Text_Common_Block} />
              </div>
              <div>
                <Button
                  size="small"
                  onClick={() => {
                    let blockNum = parseInt(blocks) + 1;
                    if (blockNum <= 7) setBlocks(blockNum);
                  }}
                >
                  <FormattedMessage
                    {...Messages.Text_TemplateSetting_AddBlock}
                  />
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
            <FormattedMessage
              {...Messages.Text_TemplateSetting_ResetTemplate}
            />
          </Button>
          <Button onClick={saveWall}>
            <FormattedMessage {...Messages.Text_Button_Save} />
          </Button>
        </Row>
      </Modal>
    </div>
  );
};

export default CreateTemplate;
