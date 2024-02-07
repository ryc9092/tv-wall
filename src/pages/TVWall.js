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
import { getWalls, getTemplates, getEncoders } from "../api/API";
import { FormattedMessage } from "react-intl";
import Messages from "../messages";
import "../App.scss";
import "./TVWall.scss";

const TVWall = () => {
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
  const [encoderElementsNormal, setEncoderElementsNormal] = useState([]);
  const [encoderElementsAbnormal, setEncoderElementsAbnormal] = useState([]);
  const [clearTvWall, setClearTvWall] = useState(null);
  const [selectedEncoder, setSelectedEncoder] = useState({
    name: "",
    previewUrl: "",
  });

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
    })();
  }, []);

  // Set "template radios" when dimension is changed
  useEffect(() => {
    (async () => {
      let tempTemplateOptions = [];
      const result = await getTemplates(store);
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
      tempTemplateOptions.forEach((template) => {
        if (template.isDefault === true) setSelectedTemplate(template);
      });
      setTemplateOptions(tempTemplateOptions);
    })();
  }, [wallDimension]);

  // Set "normal/abnormal encoder list" when search filter is changed
  useEffect(() => {
    (async () => {
      let tempNormalEncoders = [];
      let tempAbnormalEncoders = [];
      const encoders = await getEncoders(store);
      encoders.forEach((encoder) => {
        if (
          encoder.name.includes(searchFilter) ||
          encoder.nickName.includes(searchFilter)
        ) {
          if (encoder.state === "Up") tempNormalEncoders.push(encoder);
          else tempAbnormalEncoders.push(encoder);
        }
      });

      let tempNormalEncoderElements = [];
      tempNormalEncoders.forEach((encoder) => {
        tempNormalEncoderElements.push(
          <Row key={encoder.name} style={{ marginTop: "6px" }}>
            <Button
              key={encoder.name}
              id={encoder.name}
              value={encoder.previewUrl}
              type="text"
              size="small"
              style={{ cursor: "pointer" }}
              className="tvwall-encoder"
              onClick={handleChooseEncoder}
            >
              <span className="encoder-normal-dot" />
              {encoder.name}
            </Button>
          </Row>
        );
      });

      let tempAbnormalEncoderElements = [];
      tempAbnormalEncoders.forEach((encoder) => {
        tempAbnormalEncoderElements.push(
          <Row key={encoder.name} style={{ marginTop: "6px" }}>
            <Button
              key={encoder.name}
              id={encoder.name}
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
              {encoder.name}
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
      name: event.currentTarget.id,
      previewUrl: event.currentTarget.value,
    });
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
    <div>
      {store.siderCollapse ? (
        <div className="page-title">
          <FormattedMessage {...Messages.Text_TVWall_TVWallManagement} />
        </div>
      ) : (
        <div style={{ marginTop: 60 }} />
      )}
      <div
        className="container-border container-height container-width"
        style={{ marginTop: 10 }}
      >
        <div style={{ borderBottom: "1px solid gray", height: "50%" }}>
          <Row>
            <Col style={{ width: 300, margin: 8 }}>
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
                  onClick={() => {
                    setClearTvWall(Math.random);
                  }}
                  style={{ marginLeft: 8, color: "#f5222d" }}
                >
                  <FormattedMessage
                    {...Messages.Text_TVWall_ClearWallConnection}
                  />
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
                clearTvWall={clearTvWall}
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
    </div>
  );
};

export default TVWall;
