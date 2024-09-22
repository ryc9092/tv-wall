import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Card, Input, Select, Table, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import TvWall from "../components/tvwall/tvWall";
import useWindowDimensions from "../utils/WindowDimension";
import {
  activeWall,
  deactiveWall,
  getActivedWall,
  getWalls,
  getTemplates,
  getEncoders,
} from "../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
} from "../utils/Utils";
import TrashIcon from "../assets/trash.png";
import PlayIcon from "../assets/play.png";
import "../App.scss";
import "./TVWall.scss";

const TVWall = () => {
  const intl = useIntl();
  const { width, height } = useWindowDimensions();
  const [store] = useContext(StoreContext);
  const [wallOptions, setWallOptions] = useState([]);
  const [wallDimension, setWallDimension] = useState({ col: 0, row: 0 });
  const [selectedWall, setSelectedWall] = useState({});
  const [templateOptions, setTemplateOptions] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [encoders, setEncoders] = useState([]);
  const [filteredEncoders, setFilteredEncoders] = useState([]);
  const [clearTvWall, setClearTvWall] = useState(null);
  const [selectedEncoder, setSelectedEncoder] = useState({
    mac: "",
    previewUrl: "",
    nickName: "",
  });
  const [blocks, setBlocks] = useState([]);
  const [isActivedWall, setIsActivedWall] = useState(false);
  const [blockEncoderMapping, setBlockEncoderMapping] = useState({});

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
  }, [store]);

  // Set template when selected wall is changed
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
              id: template.templateId,
              ...template,
            });
          }
        });
        const activedWall = await getActivedWall({
          store: store,
          activeId: selectedWall.wallId,
        });
        // has actived wall
        if (activedWall) {
          tempTemplateOptions.forEach((option) => {
            if (option.templateId === activedWall.templateId) {
              setSelectedTemplate(option);
            }
          });
        } else {
          // no actived wall
          let hasDefaultTemplate = false;
          let lastTemplate = null;
          tempTemplateOptions.forEach((template) => {
            lastTemplate = template;
            if (template.isDefault === 1) {
              hasDefaultTemplate = true;
              setSelectedTemplate(template);
            }
          });
          if (!hasDefaultTemplate) {
            setSelectedTemplate(lastTemplate);
            setBlocks([]);
          }
        }
        setTemplateOptions(tempTemplateOptions);
      }
    })();
  }, [selectedWall]);

  // Show wall active status when selected wall changed and there is no selected template
  useEffect(() => {
    (async () => {
      if (selectedWall.wallId) {
        const activedWall = await getActivedWall({
          store: store,
          activeId: selectedWall.wallId,
        });
        if (activedWall && activedWall.templateId === selectedTemplate?.id) {
          // has actived wall, and select template is the same
          let tempMap = {};
          activedWall.blocks?.forEach((block) => {
            encoders?.forEach((encoder) => {
              if (block.encoder === encoder.mac) {
                tempMap[block.block] = {
                  mac: encoder.mac,
                  previewUrl: encoder.previewUrl,
                  nickName: encoder.nickName,
                };
              }
            });
          });
          setIsActivedWall(true);
          setBlockEncoderMapping(tempMap);
        } else {
          // has actived wall, but select the other template OR doesn't has actived wall
          setIsActivedWall(false);
          setBlocks([]);
        }
      }
    })();
  }, [selectedTemplate]);

  // Set "normal/abnormal encoder list" when search filter is changed
  useEffect(() => {
    (async () => {
      let tempFilteredEncoders = [];
      const encoders = await getEncoders(store);
      setEncoders(encoders);

      if (encoders) {
        encoders.forEach((encoder) => {
          if (encoder.nickName.includes(searchFilter))
            tempFilteredEncoders.push({ key: encoder.mac, ...encoder });
        });
      }
      setFilteredEncoders(tempFilteredEncoders);
    })();
  }, [searchFilter]);

  const changeWallSelected = (wall) => {
    setWallDimension({ col: wall.col, row: wall.row });
    setSelectedWall(wall);
  };

  const changeTemplateSelected = (template) => {
    setSelectedTemplate(template);
  };

  const handleChooseEncoder = (encoder) => {
    setSelectedEncoder({
      mac: encoder.mac,
      previewUrl: encoder.previewUrl,
      nickName: encoder.nickName,
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
          encoder: block.encoder.mac ? block.encoder.mac : "",
          marginLeft: block.marginLeft,
          marginTop: block.marginTop,
          decoder: block.decoder,
        };
      });
      const result = await activeWall({
        activeId: selectedWall.wallId,
        wallId: selectedWall.wallId,
        wallType: "normal",
        templateId: selectedTemplate.templateId,
        blocks: outputBlocks,
        isPreset: "N",
        store: store,
      });
      if (!result) throw new Error("call api failed");
      showSuccessNotificationByMsg(
        intl.formatMessage(Messages.Text_TVWall_ActiveSuccess)
      );
    } catch (error) {
      showWarningNotification(
        intl.formatMessage(Messages.Text_TVWall_ActiveFail)
      );
    }
  };

  const handleDeactiveWall = async () => {
    try {
      const result = await deactiveWall({
        activeId: selectedWall.wallId,
        store: store,
      });
      if (!result) throw new Error("call api failed");
      // clean encoder info in block
      let tempblocks = [];
      blocks.forEach((block) => {
        tempblocks.push({
          ...block,
          encoder: {
            mac: "",
            previewUrl: "",
            nickName: "",
          },
        });
      });
      setBlocks(tempblocks);
      showSuccessNotificationByMsg(
        intl.formatMessage(Messages.Text_TVWall_DeactiveSuccess)
      );
    } catch (error) {
      showWarningNotification(
        intl.formatMessage(Messages.Text_TVWall_DeactiveFail)
      );
    }
  };

  const columns = [
    {
      title: intl.formatMessage(Messages.Text_Common_EncoderName),
      dataIndex: "nickName",
      key: "nickName",
      render: (text) => {
        return (
          <span
            className="table-content"
            style={
              selectedEncoder.nickName === text
                ? { backgroundColor: "#FDEBD0" }
                : null
            }
          >
            {text}
          </span>
        );
      },
    },
    {
      title: intl.formatMessage(Messages.Text_Common_Model),
      width: "35%",
      dataIndex: "model",
      key: "model",
      filters: [
        {
          text: "ZyperUHD60",
          value: "ZyperUHD60",
        },
        {
          text: "Zyper4k",
          value: "Zyper4k",
        },
      ],
      onFilter: (value, data) => data.model.indexOf(value) === 0,
      render: (text) => {
        return <span className="table-content">{text}</span>;
      },
    },
    {
      title: intl.formatMessage(Messages.Text_Common_State),
      width: "20%",
      key: "state",
      dataIndex: "state",
      sorter: (a, b) => a.state.length - b.state.length,
      render: (_, { state, name }) => (
        <>
          {state === "Up" ? (
            <Tag color={"#eef9b4"} key={`${name}.${state}`}>
              <span style={{ color: "#a0b628" }} className="tag-content">
                <FormattedMessage {...Messages.Text_Common_Up} />
              </span>
            </Tag>
          ) : state === "Down" ? (
            <Tag color={"#ffe6e5"} key={`${name}.${state}`}>
              <span style={{ color: "#d55959" }} className="tag-content">
                <FormattedMessage {...Messages.Text_Common_Down} />
              </span>
            </Tag>
          ) : (
            <Tag color={"yellow"} key={`${name}.${state}`}>
              <span className="tag-content">{state}</span>
            </Tag>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="tvwall-layout-column">
      <div>
        <div className="page-title">
          <FormattedMessage {...Messages.Text_TVWall_TVWallManagement} />
        </div>
        <div className="tvwall-option-row">
          <div
            className={
              store.siderCollapse
                ? "tvwall-option-row-select-collapse"
                : "tvwall-option-row-select"
            }
          >
            <span className="tvwall-option-select-desc">
              <FormattedMessage {...Messages.Text_TVWall_WallName} />
            </span>
            <Select
              className="tvwall-option-select"
              options={wallOptions}
              value={selectedWall}
              onChange={(value, option) => {
                changeWallSelected(option);
              }}
            />
          </div>
          <div
            className={
              store.siderCollapse
                ? "tvwall-option-row-select-collapse"
                : "tvwall-option-row-select"
            }
          >
            <span className="tvwall-option-select-desc">
              <FormattedMessage {...Messages.Text_TVWall_Template} />
            </span>
            <Select
              className="tvwall-option-select"
              options={templateOptions}
              value={selectedTemplate}
              onChange={(value, option) => {
                changeTemplateSelected(option);
              }}
            />
          </div>
          <div
            className={
              store.siderCollapse
                ? "tvwall-option-trash-btn-collapse"
                : "tvwall-option-trash-btn"
            }
            onClick={handleDeactiveWall}
          >
            <img
              alt="trash"
              src={TrashIcon}
              className="tvwall-option-trash-icon"
            />
            <span className="tvwall-option-trash-text">
              <FormattedMessage {...Messages.Text_TVWall_ClearWallConnection} />
            </span>
          </div>
          <div className="tvwall-option-play-btn" onClick={handleActiveWall}>
            <img
              alt="play"
              src={PlayIcon}
              className="tvwall-option-play-icon"
            />
            <span className="tvwall-option-play-text">
              <FormattedMessage {...Messages.Text_TVWall_ActivateWall} />
            </span>
          </div>
        </div>
        <div
          id="wall-screen"
          className={
            store.siderCollapse
              ? "tvwall-screen-container-collapse"
              : "tvwall-screen-container"
          }
        >
          <TvWall
            wallWidth={store.siderCollapse ? 1268 : 1118}
            wallHeight={762}
            selectedWall={selectedWall}
            selectedTemplate={selectedTemplate}
            selectedEncoder={selectedEncoder}
            encoders={encoders}
            clearTvWall={clearTvWall}
            blocks={blocks}
            setBlocks={setBlocks}
            isActivedWall={isActivedWall}
            blockEncoderMapping={blockEncoderMapping}
            setBlockEncoderMapping={setBlockEncoderMapping}
          />
        </div>
      </div>
      <div
        className={
          store.siderCollapse
            ? "tvwall-card-container-collapse"
            : "tvwall-card-container"
        }
      >
        <Card className="tvwall-card-right">
          <div className="tvwall-card-right-title">
            <FormattedMessage {...Messages.Text_TVWall_VideoSource} />
          </div>
          <div className="tvwall-card-right-desc">
            <FormattedMessage {...Messages.Text_TVWall_VideoSourceDesc} />
          </div>
          {/* <div className="tvwall-card-right-preview">
            {selectedEncoder.previewUrl ? (
              <div>
                <iframe
                  className="tvwall-card-right-preview-video"
                  src={selectedEncoder.previewUrl}
                  title="Video player"
                />
                <span>{selectedEncoder.nickName}</span>
              </div>
            ) : (
              <div className="tvwall-card-right-preview-text tvwall-card-right-desc">
                <FormattedMessage {...Messages.Text_TVWall_Preview} />
              </div>
            )}
          </div> */}
          <Input
            className="tvwall-card-right-search tvwall-input"
            variant="filled"
            onChange={(e) => {
              setSearchFilter(e.target.value);
            }}
            prefix={<SearchOutlined />}
            placeholder={intl.formatMessage(Messages.Text_TVWall_InputEncoder)}
          />
          <div className="tvwall-card-right-encoder-container">
            <Table
              columns={columns}
              dataSource={filteredEncoders}
              pagination={{ pageSize: 11 }}
              onRow={(record) => ({
                onClick: () => {
                  handleChooseEncoder(record);
                },
              })}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TVWall;
