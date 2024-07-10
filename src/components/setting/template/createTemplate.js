import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../../components/store/store";
import { Button, Checkbox, Divider, Input, InputNumber, Modal } from "antd";
import { createTemplate } from "../../../api/API";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
} from "../../../utils/Utils";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../../messages";
import PlusIcon from "../../../assets/plus-white.png";
import PlusGrayIcon from "../../../assets/plus-gray.png";
import XIcon from "../../../assets/X.png";
import "../../../App.scss";
import "./createTemplate.scss";

const CreateTemplate = ({ setReload }) => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateId, setTemplateId] = useState(null);
  const [templateName, setTemplateName] = useState(null);
  const [templateSize, setTemplateSize] = useState({ col: 1, row: 1 });
  const [screenList, setScreenList] = useState([]);
  const [blocks, setBlocks] = useState(1);
  const [handledScreenList, setHandledScreenList] = useState([]);
  const [selectedScreenList, setSelectedScreenList] = useState([]);
  const [screenBlockMap, setScreenBlockMap] = useState({});
  const [templateObj, setTemplateObj] = useState(null);
  const [templateIsDefault, setTemplateIsDefault] = useState(false);

  const blockMap = { 1: "A", 2: "B", 3: "C", 4: "D", 5: "E", 6: "F", 7: "G" };

  const resetTemplate = () => {
    setTemplateId(null);
    setScreenList([]);
    setTemplateName(null);
    setTemplateSize({ col: 1, row: 1 });
    setBlocks(1);
    setHandledScreenList([]);
    setSelectedScreenList([]);
    setScreenBlockMap({});
    setTemplateObj(null);
    setTemplateIsDefault(false);
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

  useEffect(() => {
    // create template table
    let tempRow = [];
    let tempTemplate = [];
    screenList.forEach((screen) => {
      tempRow.push(
        <td
          className={
            selectedScreenList?.includes(screen.num)
              ? "screen-block-selected"
              : handledScreenList?.includes(screen.num)
              ? "screen-block-handled"
              : "screen-block-default"
          }
          key={screen.num}
          onClick={() => {
            setSelectedScreenList([...selectedScreenList, screen.num]);
          }}
        >
          <span
            className={
              selectedScreenList?.includes(screen.num)
                ? "screen-block-text-selected"
                : handledScreenList?.includes(screen.num)
                ? "screen-block-text-handled"
                : "screen-block-text-default"
            }
          >
            {screen.num}
          </span>

          {screen.num in screenBlockMap ? (
            <span className="screen-block-num screen-block-num-text">
              {blockMap[screenBlockMap[screen.num]]}
            </span>
          ) : null}
        </td>
      );
      if (tempRow.length === templateSize.col) {
        tempTemplate.push(<tr key={screen.num}>{tempRow}</tr>);
        tempRow = []; // clear row
      }
    });
    setTemplateObj(tempTemplate);
  }, [screenList, selectedScreenList, handledScreenList, screenBlockMap]);

  // initialize block radios by block number:
  const blockNum = Array.from({ length: blocks }, (v, i) => i + 1); // make a block list [1, 2, 3, ...]
  let blockOptions = (
    <>
      {blockNum.map((block) => {
        return (
          <div
            key={block}
            value={block}
            className="block-option"
            onClick={() => {
              setHandledScreenList([
                ...handledScreenList,
                ...selectedScreenList,
              ]);
              setSelectedScreenList([]);
              let tempMap = {};
              selectedScreenList?.forEach((screen) => {
                tempMap[screen] = block;
              });
              setScreenBlockMap({ ...screenBlockMap, ...tempMap });
            }}
          >
            <FormattedMessage {...Messages.Text_Common_Block} />{" "}
            {blockMap[block]}
          </div>
        );
      })}
    </>
  );

  const saveWall = () => {
    // set block info to screen list
    let screenListWithBlock = [];
    screenList?.forEach((screen) => {
      screenListWithBlock.push({
        num: screen.num,
        block: screenBlockMap[screen.num],
      });
    });
    (async () => {
      const result = await createTemplate(
        store,
        templateId,
        templateName,
        templateSize.col,
        templateSize.row,
        templateIsDefault ? 1 : 0,
        screenListWithBlock
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
      <Button
        className="create-template-btn"
        onClick={() => setIsModalOpen(true)}
      >
        <img alt="create" src={PlusIcon} className="create-template-btn-icon" />
        <span className="create-template-btn-text">
          <FormattedMessage {...Messages.Text_TemplateSetting_CreateTemplate} />
        </span>
      </Button>
      <Modal
        title=<span className="create-template-modal-title">
          {intl.formatMessage(Messages.Text_TemplateSetting_CreateWallTemplate)}
        </span>
        className="create-template-modal create-template-setting modal-title"
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          resetTemplate();
          setIsModalOpen(false);
        }}
      >
        <div className="input-option-row">
          <div style={{ marginRight: 100 }}>
            <span className="input-title">
              <FormattedMessage {...Messages.Text_TemplateSetting_TemplateId} />
            </span>
            <Input
              value={templateId}
              className="input-object"
              placeholder={intl.formatMessage(Messages.Text_Common_InputID)}
              onChange={(e) => {
                setTemplateId(e.target.value);
              }}
            />
          </div>
          <div style={{ marginRight: 100 }}>
            <span className="input-title">
              <FormattedMessage
                {...Messages.Text_TemplateSetting_TemplateName}
              />
            </span>
            <Input
              value={templateName}
              className="input-object"
              placeholder={intl.formatMessage(Messages.Text_Common_InputName)}
              onChange={(e) => {
                setTemplateName(e.target.value);
              }}
            />
          </div>
          <div>
            <span className="input-title">
              <FormattedMessage {...Messages.Text_WallSetting_WallDimension} />
            </span>
            <div className="input-dimension-row">
              <InputNumber
                value={templateSize.col}
                min={1}
                max={5}
                className="input-object input-dimension"
                onChange={(value) =>
                  setTemplateSize({ ...templateSize, col: value })
                }
              />
              <img
                alt="x"
                src={XIcon}
                className="input-dimension-multiply-icon"
              />
              <InputNumber
                value={templateSize.row}
                min={1}
                max={4}
                className="input-object input-dimension"
                onChange={(value) =>
                  setTemplateSize({ ...templateSize, row: value })
                }
              />
            </div>
          </div>
        </div>
        <Divider className="divider" />
        <div className="create-template-second-title">
          <FormattedMessage {...Messages.Text_TemplateSetting_BlockSetting} />
        </div>
        <div className="create-template-desc">
          <FormattedMessage
            {...Messages.Text_TemplateSetting_BlockSettingDesc}
          />
        </div>
        <div className="screen-setting-row">
          <div>
            <table style={{ border: 0, borderCollapse: "collapse" }}>
              <tbody>{templateObj}</tbody>
            </table>
          </div>
          <div className="block-setting-container">
            <div className="block-setting-container-row">
              <div className="block-setting-container-title">
                <FormattedMessage {...Messages.Text_Common_Block} />
              </div>
              <div>
                <Button
                  type="text"
                  onClick={() => {
                    let blockNum = parseInt(blocks) + 1;
                    if (blockNum <= 7) setBlocks(blockNum);
                  }}
                  className="block-setting-add-block-button"
                >
                  <img
                    alt="add"
                    src={PlusGrayIcon}
                    className="block-setting-add-block-icon"
                  />
                </Button>
              </div>
            </div>
            <Divider className="block-setting-divider" />
            <div className="block-option-container">{blockOptions}</div>
          </div>
        </div>
        <div className="is-default-ckbox-container">
          <Checkbox
            checked={templateIsDefault}
            onChange={(e) => {
              setTemplateIsDefault(e.target.checked);
            }}
          />
          <span className="is-default-ckbox-text">
            {intl
              .formatMessage(Messages.Text_TemplateSetting_SetToDefault)
              .replace("XXX", ` ${templateSize.col} X ${templateSize.row} `)}
          </span>
        </div>
        <div className="screen-setting-submit-row">
          <div>
            <Button
              type="text"
              onClick={resetTemplate}
              className="screen-setting-clear-btn"
            >
              <span className="screen-setting-clear-btn-text">
                <FormattedMessage {...Messages.Text_Button_Clear} />
              </span>
            </Button>
          </div>
          <div>
            <Button onClick={saveWall} className="screen-setting-create-btn">
              <span className="screen-setting-create-btn-text">
                <FormattedMessage {...Messages.Text_Button_Create} />
              </span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateTemplate;
