import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import {
  Button,
  Col,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import TvWall from "../components/tvwall/tvWall";
import useWindowDimensions from "../utils/WindowDimension";
import { ENCODER_TYPERS } from "../utils/Constant";
import { presetWall, getWalls, getTemplates, getEncoders } from "../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
} from "../utils/Utils";
import "../App.scss";
import "./TVWall.scss";

const SituationTVWall = ({
  situationId,
  openParentModal,
  setReloadPresetDetails,
  detailsNum,
  reload,
}) => {
  const intl = useIntl();
  const { width } = useWindowDimensions();
  const [store] = useContext(StoreContext);
  const [isSmallElement, setIsSmallElement] = useState(false);
  const [encoderType, setEncoderType] = useState("1");
  const [wallOptions, setWallOptions] = useState([]);
  const [wallDimension, setWallDimension] = useState({ col: 0, row: 0 });
  const [selectedWall, setSelectedWall] = useState({});
  const [templateOptions, setTemplateOptions] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [encoders, setEncoders] = useState([]);
  const [encoderElementsNormal, setEncoderElementsNormal] = useState([]);
  const [encoderElementsAbnormal, setEncoderElementsAbnormal] = useState([]);
  const [clearTvWall, setClearTvWall] = useState(null);
  const [selectedEncoder, setSelectedEncoder] = useState({
    mac: "",
    previewUrl: "",
  });
  const [blocks, setBlocks] = useState([]);
  const [blockEncoderMapping, setBlockEncoderMapping] = useState({});

  // clear selected items
  useEffect(() => {
    setSelectedWall({});
    setTemplateOptions([]);
    setSelectedTemplate(null);
    setSelectedEncoder({ mac: "", previewUrl: "" });
    setBlocks([]);
  }, [reload]);

  // The elements size would be changed according to width
  useEffect(() => {
    if (width > 824 && isSmallElement) setIsSmallElement(false);
    else if (width < 824 && !isSmallElement) setIsSmallElement(true);
  }, [isSmallElement, width]);

  // Set "wall options"
  useEffect(() => {
    (async () => {
      let tempWallOptions = [];
      const result = await getWalls(store);
      if (result) {
        result.forEach((wall) => {
          tempWallOptions.push({
            value: wall.wallName,
            label: wall.wallName,
            ...wall,
          });
        });
        setWallOptions(tempWallOptions);
        setWallDimension({
          col: tempWallOptions[0].col,
          row: tempWallOptions[0].row,
        });
        setSelectedWall(tempWallOptions[0]);
      }
    })();
  }, [store, reload]);

  // Set "template radios" when dimension is changed
  useEffect(() => {
    (async () => {
      let tempTemplateOptions = [];
      const result = await getTemplates(store);
      if (result) {
        result.forEach((template) => {
          if (
            template.col === wallDimension.col &&
            template.row === wallDimension.row
          ) {
            tempTemplateOptions.push({
              value: template.templateName,
              label: template.templateName,
              ...template,
            });
          }
        });
        let hasDefaultTemplate = false;
        tempTemplateOptions.forEach((template) => {
          if (template.isDefault === 1) {
            hasDefaultTemplate = true;
            setSelectedTemplate(template);
          }
        });
        if (!hasDefaultTemplate) {
          setSelectedTemplate(null);
          setBlocks([]);
        }
        setTemplateOptions(tempTemplateOptions);
      }
    })();
  }, [wallDimension, selectedWall]);

  // Set "normal/abnormal encoder list" when search filter is changed
  useEffect(() => {
    (async () => {
      let tempNormalEncoders = [];
      let tempAbnormalEncoders = [];
      const encoders = await getEncoders(store);
      setEncoders(encoders);
      encoders.forEach((encoder) => {
        if (
          encoder.mac.includes(searchFilter) ||
          encoder.nickName.includes(searchFilter)
        ) {
          if (encoder.state === "Up") tempNormalEncoders.push(encoder);
          else tempAbnormalEncoders.push(encoder);
        }
      });

      let tempNormalEncoderElements = [];
      tempNormalEncoders.forEach((encoder) => {
        tempNormalEncoderElements.push(
          <Row key={encoder.mac} style={{ marginTop: "6px" }}>
            <Button
              key={encoder.mac}
              id={encoder.mac}
              value={encoder.previewUrl}
              type="text"
              size="small"
              style={{ cursor: "pointer" }}
              className="tvwall-encoder"
              onClick={handleChooseEncoder}
            >
              <span className="encoder-normal-dot" />
              {encoder.nickName}
            </Button>
          </Row>
        );
      });

      let tempAbnormalEncoderElements = [];
      tempAbnormalEncoders.forEach((encoder) => {
        tempAbnormalEncoderElements.push(
          <Row key={encoder.mac} style={{ marginTop: "6px" }}>
            <Button
              key={encoder.mac}
              id={encoder.mac}
              type="text"
              size="small"
              style={{ cursor: "pointer" }}
            >
              <span
                className={
                  encoder.state === "Down"
                    ? "encoder-down-dot"
                    : "encoder-abnormal-dot"
                }
              />
              {encoder.nickName}
            </Button>
          </Row>
        );
      });

      setEncoderElementsNormal(tempNormalEncoderElements);
      setEncoderElementsAbnormal(tempAbnormalEncoderElements);
    })();
  }, [searchFilter]);

  const changeWallSelected = (wall) => {
    setWallDimension({ col: wall.col, row: wall.row });
    setSelectedWall(wall);
  };

  const changeTemplateSelected = (template) => {
    let tempTemplateOptions = templateOptions.slice();
    templateOptions.forEach((option, idx) => {
      if (option.templateId === template.value) {
        tempTemplateOptions[idx].isDefault = true;
        template.templateId = template.value;
        setSelectedTemplate(template);
      } else tempTemplateOptions[idx].isDefault = false;
    });
    setTemplateOptions(tempTemplateOptions);
  };

  const changeEncoderType = ({ target: { value } }) => {
    setEncoderType(value);
  };

  const handleChooseEncoder = (event) => {
    setSelectedEncoder({
      mac: event.currentTarget.id,
      previewUrl: event.currentTarget.value,
    });
  };

  const handleActiveWall = async () => {
    try {
      let outputBlocks = [];

      blocks.forEach((block, idx) => {
        outputBlocks[idx] = {
          block: block.block,
          row: block.row,
          col: block.col,
          encoder: block.encoder.mac,
          marginLeft: block.marginLeft,
          marginTop: block.marginTop,
          decoder: block.decoder,
        };
      });
      const result = await presetWall({
        activeId: `preset.${selectedWall.wallId}`,
        wallId: selectedWall.wallId,
        templateId: selectedTemplate.templateId,
        blocks: outputBlocks,
        presetPostDetail: { preSetId: situationId, orderNum: detailsNum + 1 },
        store: store,
      });
      if (!result) throw new Error("call api failed");
      openParentModal(false);
      setReloadPresetDetails(Math.random());
      showSuccessNotificationByMsg(
        intl.formatMessage(Messages.Text_TVWall_ActiveSuccess)
      );
    } catch (error) {
      showWarningNotification(
        intl.formatMessage(Messages.Text_TVWall_ActiveFail)
      );
    }
  };

  const encoderBlock = (
    <div
      style={{ borderRight: "1px solid gray", width: "60%", minWidth: "345px" }}
    >
      <Row style={{ margin: "8px 0px 0px 8px", height: "11%" }}>
        <Col>
          <Typography.Text style={{ fontSize: "20px", marginRight: "10px" }}>
            <FormattedMessage {...Messages.Text_TVWall_VideoSource} />
          </Typography.Text>
        </Col>
        <Col>
          <Input
            onChange={(e) => {
              setSearchFilter(e.target.value);
            }}
            prefix={<SearchOutlined />}
          />
        </Col>
      </Row>
      <Row style={{ height: "15%" }}>
        <Radio.Group
          options={ENCODER_TYPERS}
          onChange={changeEncoderType}
          value={encoderType}
          optionType="button"
          buttonStyle="solid"
          style={{ margin: "10px 0px 0px 8px" }}
          size={isSmallElement ? "small" : "middle"}
        />
      </Row>
      <div
        className="tvwall-encoder-layout"
        style={{ margin: "8px 0px 0px 15px" }}
      >
        <div style={{ overflowY: "scroll", width: "89%" }}>
          {encoderElementsNormal}
        </div>
        <div style={{ overflowY: "scroll", width: "89%" }}>
          {encoderElementsAbnormal}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-border container-height container-width">
      <div style={{ borderBottom: "1px solid gray", height: "50%" }}>
        <Row>
          <Col style={{ width: 415, margin: 8 }}>
            <Row>
              <Select
                options={wallOptions}
                value={selectedWall}
                onChange={(value, option) => {
                  changeWallSelected(option);
                }}
                style={{ minWidth: 130 }}
              />
              <Button
                onClick={handleActiveWall}
                type="primary"
                style={{ marginLeft: 8 }}
              >
                <FormattedMessage {...Messages.Text_TVWall_ActivateWall} />
              </Button>
            </Row>
            <Radio.Group
              onChange={(e) => {
                changeTemplateSelected(e.target);
              }}
              value={selectedTemplate?.templateId}
              style={{ margin: "10px 0px 0px 0px" }}
              size={isSmallElement ? "small" : "middle"}
            >
              <Space direction="vertical">
                {templateOptions.map((template) => (
                  <Radio
                    key={template?.templateName}
                    value={template.templateId}
                    style={{ marginTop: 5 }}
                    col={template?.col}
                    row={template?.row}
                  >
                    {template.templateName}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
            <br />
          </Col>
          <Col style={{ margin: "auto", marginTop: 1 }}>
            <TvWall
              selectedWall={selectedWall}
              selectedTemplate={selectedTemplate}
              selectedEncoder={selectedEncoder}
              encoders={encoders}
              clearTvWall={clearTvWall}
              blocks={blocks}
              setBlocks={setBlocks}
              blockEncoderMapping={blockEncoderMapping}
              setBlockEncoderMapping={setBlockEncoderMapping}
            />
          </Col>
        </Row>
      </div>
      <div style={{ height: "50%" }} className="tvwall-video-layout ">
        {encoderBlock}
        <div style={{ width: "40%" }}>
          {selectedEncoder.previewUrl ? (
            <embed
              style={{ width: "100%", height: "100%" }}
              src={selectedEncoder.previewUrl}
              title="Video player"
            />
          ) : (
            <div
              style={{
                position: "relative",
                top: "50%",
                marginLeft: "62%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <FormattedMessage {...Messages.Text_TVWall_Preview} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SituationTVWall;
