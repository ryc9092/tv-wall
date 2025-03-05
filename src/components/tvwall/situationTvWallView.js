import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../components/store/store";
import {
  Button,
  Card,
  Divider,
  Input,
  Modal,
  Select,
  Table,
  Tag,
  Radio,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import TvWall from "./situationTvWallBlockView";
import {
  getActivedWall,
  getWalls,
  getTemplates,
  presetWall,
} from "../../api/API";
import { showWarningNotification } from "../../utils/Utils";
import { uuid } from "../../utils/Utils";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../messages";
import "./tvWall.scss";
import "../../pages/TVWall.scss";

const TVWallViewModal = ({
  situationDetailId,
  isModalOpen,
  setIsModalOpen,
  setReload,
  encoders,
  setEncoders,
}) => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [situationItemDesc, setSituationItemDesc] = useState("");
  const [wallOptions, setWallOptions] = useState([]);
  const [wallDimension, setWallDimension] = useState({ col: 0, row: 0 });
  const [selectedWall, setSelectedWall] = useState({});
  const [templateOptions, setTemplateOptions] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedBlockNumber, setSelectedBlockNumber] = useState(null);
  const [clearBlockNumber, setClearBlockNumber] = useState(null);
  const [selectedEncoder, setSelectedEncoder] = useState({
    mac: "",
    previewUrl: "",
    nickName: "",
  });
  const [filteredEncoders, setFilteredEncoders] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [blockEncoderMapping, setBlockEncoderMapping] = useState({});
  const [blocksDetail, setBlocksDetail] = useState([]); // [{block: 1, smallestScreenNum: 1, col: 1, row: 1, details: [...]}]

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
  }, [store, isModalOpen]);

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
        }
        setTemplateOptions(tempTemplateOptions);
      }
    })();
  }, [selectedWall]);

  // Set "normal/abnormal encoder list" when search filter is changed
  useEffect(() => {
    (async () => {
      let tempFilteredEncoders = [];
      if (encoders) {
        encoders.forEach((encoder) => {
          if (encoder.nickName.includes(searchFilter))
            tempFilteredEncoders.push({ key: encoder.mac, ...encoder });
        });
      }
      setFilteredEncoders(tempFilteredEncoders);
    })();
  }, [searchFilter, isModalOpen, encoders]);

  const changeWallSelected = (wall) => {
    setWallDimension({ col: wall.col, row: wall.row });
    setSelectedWall(wall);
  };

  const [chooseEncoderTime, setChooseEncoderTime] = useState(null);
  const handleChooseEncoder = (encoder) => {
    // prevent choose encoder interval too short
    if (chooseEncoderTime === null || Date.now() - chooseEncoderTime > 300) {
      // unselect encoder if it already selected
      if (selectedEncoder.mac === encoder.mac)
        setSelectedEncoder({
          nickName: "",
          mac: "",
          previewUrl: "",
        });
      else
        setSelectedEncoder({
          nickName: encoder.nickName,
          mac: encoder.mac,
          previewUrl: encoder.previewUrl,
        });
    }
    setChooseEncoderTime(Date.now());
  };

  const columns = [
    {
      dataIndex: "mac",
      key: "radio",
      render: (text) => {
        return (
          <Radio
            disabled
            id={`btn@${text}`}
            checked={selectedEncoder.mac === text}
          />
        );
      },
    },
    {
      title: intl.formatMessage(Messages.Text_Common_EncoderName),
      dataIndex: "nickName",
      key: "nickName",
      render: (text) => {
        return <span className="table-content sdcp-font">{text}</span>;
      },
    },
    {
      title: intl.formatMessage(Messages.Text_Common_Model),
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
        return <span className="table-content sdcp-font">{text}</span>;
      },
    },
    {
      title: intl.formatMessage(Messages.Text_Common_State),
      width: "25%",
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

  // set link of block & encoder
  useEffect(() => {
    if (selectedBlockNumber && selectedEncoder.mac) {
      setBlockEncoderMapping({
        ...blockEncoderMapping,
        [selectedBlockNumber]: selectedEncoder,
      });
      setSelectedBlockNumber(null);
      setSelectedEncoder({
        nickName: "",
        mac: "",
        previewUrl: "",
      });
    }
  }, [blockEncoderMapping, selectedBlockNumber, selectedEncoder]);

  useEffect(() => {
    if (clearBlockNumber) {
      setBlockEncoderMapping({
        ...blockEncoderMapping,
        [clearBlockNumber]: { mac: "", previewUrl: "", nickName: "" },
      });
      setClearBlockNumber(null);
      setSelectedBlockNumber(null);
    }
  }, [clearBlockNumber]);

  const handleReset = () => {
    setSituationItemDesc("");
    setWallOptions([]);
    setWallDimension({ col: 0, row: 0 });
    setSelectedWall({});
    setSelectedTemplate(null);
    setSelectedEncoder({
      mac: "",
      previewUrl: "",
      nickName: "",
    });
    setFilteredEncoders([]);
    setSearchFilter("");
    setEncoders([]);
    setBlocks([]);
    setBlockEncoderMapping({});
  };

  return (
    <div>
      <Modal
        title={
          <span className="wall-modal-title">
            <FormattedMessage {...Messages.Text_Situation_AddSituationItem} />
            {" - "}
            <FormattedMessage {...Messages.Text_Situation_TVWallConnection} />
          </span>
        }
        className="wall-modal wall-content-modal-close-icon wall-content modal-title"
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          handleReset();
          setIsModalOpen(false);
        }}
      >
        <div className="situation-wall-layout-column">
          <div className="situation-wall-option-container">
            <div className="situation-wall-option-row">
              <div className="situation-wall-input-layout-column">
                <div>
                  <div className="situation-wall-input-text">
                    <FormattedMessage {...Messages.Text_Common_Description} />
                  </div>
                  <div>
                    <Input
                      className="situation-wall-input situation-wall-input-placeholder"
                      value={situationItemDesc}
                      placeholder={intl.formatMessage(
                        Messages.Text_Situation_InputDescription
                      )}
                      onChange={(e) => {
                        setSituationItemDesc(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="situation-wall-input-layout-column">
                <div>
                  <div className="situation-wall-input-text">
                    <FormattedMessage {...Messages.Text_WallSetting_WallName} />
                    {" : "}
                  </div>
                  <div>
                    <Select
                      className="situation-wall-input"
                      options={wallOptions}
                      value={selectedWall}
                      onChange={(value, option) => {
                        changeWallSelected(option);
                      }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: 24 }}>
                  <div className="situation-wall-input-text">
                    <FormattedMessage {...Messages.Text_TVWall_Template} />
                    {" : "}
                  </div>
                  <div>
                    <Select
                      className="situation-wall-input"
                      options={templateOptions}
                      value={selectedTemplate}
                      onChange={(value, option) => {
                        setSelectedTemplate(option);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Divider className="divider" />
            <div className="connection-title">
              <FormattedMessage {...Messages.Text_Situation_TVWallConnection} />
            </div>
            <div style={{ width: 891, height: 535 }}>
              <TvWall
                wallWidth={891}
                wallHeight={535}
                selectedWall={selectedWall}
                selectedTemplate={selectedTemplate}
                selectedEncoder={selectedEncoder}
                encoders={encoders}
                blocks={blocks}
                setBlocks={setBlocks}
                blockEncoderMapping={blockEncoderMapping}
                setBlockEncoderMapping={setBlockEncoderMapping}
                selectedBlockNumber={selectedBlockNumber}
                setSelectedBlockNumber={setSelectedBlockNumber}
                setClearBlockNumber={setClearBlockNumber}
                blocksDetail={blocksDetail}
                setBlocksDetail={setBlocksDetail}
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
              <div className="tvwall-card-right-preview">
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
              </div>
              <Input
                className="tvwall-card-right-search tvwall-input"
                variant="filled"
                onChange={(e) => {
                  setSearchFilter(e.target.value);
                }}
                prefix={<SearchOutlined />}
                placeholder={intl.formatMessage(
                  Messages.Text_TVWall_InputEncoder
                )}
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
        <div className="situation-wall-item-btn-row">
          <Button
            className="situation-wall-item-cancel-btn"
            style={{ marginRight: 16 }}
            onClick={() => {
              handleReset();
              setIsModalOpen(false);
            }}
          >
            <span className="item-cancel-btn-text">
              <FormattedMessage {...Messages.Text_Button_Cancel} />
            </span>
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TVWallViewModal;
