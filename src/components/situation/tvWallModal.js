import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../components/store/store";
import { Button, Card, Divider, Input, Modal, Select, Table, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import TvWall from "./tvWall";
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
import "./addSituationContent.scss";
import "./tvWallModal.scss";
import "../../pages/TVWall.scss";

const TVWallModal = ({
  situation,
  situationItemLength,
  isModalOpen,
  setIsModalOpen,
  setReload,
  encoders,
  setEncoders,
}) => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [situationItemDesc, setSituationItemDesc] = useState(null);
  const [wallOptions, setWallOptions] = useState([]);
  const [wallDimension, setWallDimension] = useState({ col: 0, row: 0 });
  const [selectedWall, setSelectedWall] = useState({});
  const [templateOptions, setTemplateOptions] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedEncoder, setSelectedEncoder] = useState({
    mac: "",
    previewUrl: "",
    nickName: "",
  });
  const [filteredEncoders, setFilteredEncoders] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [blocks, setBlocks] = useState([]);
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

  const handleChooseEncoder = (encoder) => {
    setSelectedEncoder({
      mac: encoder.mac,
      previewUrl: encoder.previewUrl,
      nickName: encoder.nickName,
    });
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

  const handleReset = () => {
    setSituationItemDesc(null);
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

  const handleCreateItem = async () => {
    if (selectedWall && selectedTemplate && situationItemDesc) {
      let tempBlocks = [];
      Object.entries(blockEncoderMapping)?.forEach(([key, block]) => {
        tempBlocks.push({
          block: parseInt(key),
          encoder: block.mac,
          col: block.col,
          row: block.row,
        });
      });
      await presetWall({
        store: store,
        activeId: `tvwall@${uuid()}`,
        wallId: selectedWall.wallId,
        templateId: selectedTemplate.templateId,
        blocks: tempBlocks,
        presetPostDetail: {
          preSetId: situation.id,
          orderNum: situationItemLength + 1,
          remark: situationItemDesc,
        },
      });
      handleReset();
      setReload(Math.random());
      setIsModalOpen(false);
    } else {
      showWarningNotification(
        intl.formatMessage(Messages.Text_Common_RequiredHint)
      );
    }
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
          <Button
            className="item-submit-btn"
            onClick={() => {
              handleCreateItem();
            }}
          >
            <span className="item-submit-btn-text">
              <FormattedMessage {...Messages.Text_Button_Add} />
            </span>
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TVWallModal;
