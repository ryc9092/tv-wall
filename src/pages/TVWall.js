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
  const [encoderElementsNormal, setEncoderElementsNormal] = useState([]);
  const [encoderElementsAbnormal, setEncoderElementsAbnormal] = useState([]);

  // The elements size would be changed according to width
  useEffect(() => {
    if (width > 824 && isSmallElement) setIsSmallElement(false);
    else if (width < 824 && !isSmallElement) setIsSmallElement(true);
  }, [isSmallElement, width]);

  // Set "wall options" and "normal/abnormal encoder list"
  useEffect(() => {
    (async () => {
      let tempWallOptions = [];
      const result = await getWalls();
      result.forEach((wall) => {
        tempWallOptions.push({ value: wall.wallName, label: wall.wallName, ...wall });
      });
      setWallOptions(tempWallOptions);
      setWallDimension({col: tempWallOptions[0].col, row: tempWallOptions[0].row});
      setSelectedWall(tempWallOptions[0]);
    })();

    (async () => {
      let tempNormalEncoders = [];
      let tempAbnormalEncoders = [];
      const encoders = await getEncoders(store);
      encoders.forEach((encoder) => {
        if (encoder.state === "Up") tempNormalEncoders.push(encoder);
        else tempAbnormalEncoders.push(encoder);
      });

      let tempNormalEncoderElements = [];
      tempNormalEncoders.forEach((encoder) => {
        tempNormalEncoderElements.push(
          <Row key={encoder.name} style={{ marginTop: "6px" }}>
            <Button
              key={encoder.name}
              id={encoder.name}
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
  }, []);

  // Set "template radios" when dimension is changed
  useEffect(() => {
    (async () => {
      let tempTemplateOptions = [];
      const result = await getTemplates();
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

  const changeWallSelected = (wall) => {
    setWallDimension({col: wall.col, row: wall.row});
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
    console.log(event.currentTarget.id);
  };

  const encoderBlock = (
    <div
      style={{ borderRight: "1px solid gray", width: "60%", minWidth: "345px" }}
    >
      <Row style={{ margin: "8px 0px 0px 8px", height: "11%" }}>
        <Col>
          <Typography.Text style={{ fontSize: "20px", marginRight: "10px" }}>
            影像來源
          </Typography.Text>
        </Col>
        <Col>
          <Input prefix={<SearchOutlined />} />
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
        <div className="page-title">電視牆影音管理</div>
      ) : (
        <div style={{ marginTop: 60 }} />
      )}
      <div className="container-border container-height container-width">
        <div style={{ borderBottom: "1px solid gray", height: "50%" }}>
          <Row>
            <Col style={{ width: 270, margin: 8 }}>
              <Row>
                <Select
                  options={wallOptions}
                  value={selectedWall}
                  onChange={(value, option) => {
                    changeWallSelected(option);
                  }}
                  style={{ minWidth: 130 }}
                />
                <Button style={{ marginLeft: 8, color: "#f5222d" }}>
                  清除牆面連接
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
                    >
                      {template.templateName}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
              <br />
            </Col>
            <Col style={{ margin: 8 }}>
              <TvWall
                selectedWall={selectedWall}
                selectedTemplate={selectedTemplate}
              />
            </Col>
          </Row>
        </div>
        <div style={{ height: "50%" }} className="tvwall-video-layout ">
          {encoderBlock}
          <div style={{ width: "40%" }}>
            <video controls style={{ width: "100%", height: "100%" }}>
              <source src={""} type="video/mp4" />
              Sorry, your browser doesn't support embedded videos.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVWall;
