import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Actions } from "../components/store/reducer";
import { Button, Card, Input, Select, Table, Tag, Modal, Radio } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import TvWall from "../components/tvwall/tvWall";
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
import ClearLinkIcon from "../assets/clearLinkIconRed.png";
import "../App.scss";
import "./TVWall.scss";

import useWindowDimensions from "../utils/WindowDimension";

const TVWall = () => {
  const intl = useIntl();
  const [store, dispatch] = useContext(StoreContext);
  const { width, height } = useWindowDimensions();
  const [wallOptions, setWallOptions] = useState([]);
  const [wallDimension, setWallDimension] = useState({ col: 0, row: 0 });
  const [selectedWall, setSelectedWall] = useState({});
  const [templateOptions, setTemplateOptions] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedBlockNumber, setSelectedBlockNumber] = useState(null);
  const [clearBlockNumber, setClearBlockNumber] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [encoders, setEncoders] = useState([]);
  const [filteredEncoders, setFilteredEncoders] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [clearTvWall, setClearTvWall] = useState(null);
  const [selectedEncoder, setSelectedEncoder] = useState({
    mac: "",
    previewUrl: "",
    nickName: "",
  });
  const [blocks, setBlocks] = useState([]);
  const [blocksDetail, setBlocksDetail] = useState([]); // [{block: 1, smallestScreenNum: 1, col: 1, row: 1, details: [...]}]
  const [isActivedWall, setIsActivedWall] = useState(false);
  const [blockEncoderMapping, setBlockEncoderMapping] = useState({});
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [reload, setReload] = useState(null);

  useEffect(() => {
    if (width < 1240)
      dispatch({ type: Actions.SetSiderCollapse, payload: true });
  }, [dispatch, width]);

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
  }, []);

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
        let activedWall;
        if (selectedWall.wallId) {
          activedWall = await getActivedWall({
            store: store,
            activeId: selectedWall.wallId,
          });
        }
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
  }, [selectedWall, wallDimension.col, wallDimension.row]);

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
          setBlockEncoderMapping({});
        }
      }
    })();
  }, [selectedTemplate, encoders, selectedWall.wallId, reload]);

  const handleActiveWall = async (data) => {
    activeWall(data).then((result) => {
      if (result) {
        showSuccessNotificationByMsg(
          intl.formatMessage(Messages.Text_TVWall_ActiveSuccess)
        );
      } else {
        showWarningNotification(
          intl.formatMessage(Messages.Text_TVWall_ActiveFail)
        );
      }
      setSelectedBlockNumber(null);
      setSelectedEncoder({
        nickName: "",
        mac: "",
        previewUrl: "",
      });
      setReload(Math.random());
    });
  };

  useEffect(() => {
    if (selectedBlockNumber && selectedEncoder.mac) {
      let apiFormatBlocks = [];
      blocksDetail?.forEach((block) => {
        let blockDecoders = [];
        block.detail?.forEach((detail) => {
          blockDecoders.push(detail.decoder);
        });
        apiFormatBlocks.push({
          block: block.block,
          col: block.col,
          row: block.row,
          // update block to link new encoder
          encoder:
            selectedBlockNumber.toString() === block.block.toString()
              ? selectedEncoder.mac
              : block.detail[0].encoder,
          decoder: blockDecoders,
        });
      });
      const data = {
        activeId: selectedWall.wallId,
        wallId: selectedWall.wallId,
        wallType: "normal",
        templateId: selectedTemplate.templateId,
        blocks: apiFormatBlocks,
        isPreset: "N",
        store: store,
      };
      handleActiveWall(data);
    }
  }, [
    selectedBlockNumber,
    selectedEncoder,
    intl,
    blocksDetail,
    selectedWall,
    selectedTemplate,
  ]);

  useEffect(() => {
    (async () => {
      if (clearBlockNumber) {
        try {
          let unlinkDecoders = [];
          blocksDetail?.forEach((block) => {
            if (clearBlockNumber === block.block.toString()) {
              block.detail?.forEach((detail) => {
                unlinkDecoders.push(detail.decoder);
              });
            }
          });
          const result = await deactiveWall({
            activeId: selectedWall.wallId,
            store: store,
            decoders: unlinkDecoders,
          });
          if (!result) throw new Error("call api failed");
          else {
            showSuccessNotificationByMsg(
              intl.formatMessage(Messages.Text_TVWall_DeactiveSuccess)
            );
            setClearBlockNumber(null);
            setReload(Math.random());
          }
        } catch (error) {
          showWarningNotification(
            intl.formatMessage(Messages.Text_TVWall_DeactiveFail)
          );
        }
      }
    })();
  }, [clearBlockNumber, intl, selectedWall]);

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
      setBlockEncoderMapping({});
      showSuccessNotificationByMsg(
        intl.formatMessage(Messages.Text_TVWall_DeactiveSuccess)
      );
    } catch (error) {
      showWarningNotification(
        intl.formatMessage(Messages.Text_TVWall_DeactiveFail)
      );
    }
    setOpenConfirmModal(false);
  };

  const columns = [
    {
      dataIndex: "mac",
      key: "radio",
      render: (text) => {
        return (
          <Radio id={`btn@${text}`} checked={selectedEncoder.mac === text} />
        );
      },
    },
    {
      title: intl.formatMessage(Messages.Text_Common_EncoderName),
      dataIndex: "nickName",
      key: "nickName",
      minWidth: 55,
      render: (text) => {
        return <span className="table-content">{text}</span>;
      },
    },
    {
      title: intl.formatMessage(Messages.Text_Common_Model),
      dataIndex: "model",
      key: "model",
      minWidth: 105,
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
            className="tvwall-option-trash-btn"
            onClick={() => {
              setOpenConfirmModal(true);
            }}
          >
            <img
              alt="trash"
              src={ClearLinkIcon}
              className="tvwall-option-trash-icon"
            />
            <span className="tvwall-option-trash-text">
              <FormattedMessage {...Messages.Text_TVWall_ClearWallConnection} />
            </span>
          </div>
          <Modal
            className="audio-modal-close-x"
            title={
              <span style={{ marginRight: 12 }}>
                <FormattedMessage
                  {...Messages.Text_TVWall_ClearWallConnection}
                />
              </span>
            }
            width={400}
            okText={intl.formatMessage(Messages.Text_Common_Confirm)}
            cancelText={intl.formatMessage(Messages.Text_Button_Cancel)}
            open={openConfirmModal}
            onCancel={() => {
              setOpenConfirmModal(false);
            }}
            onOk={handleDeactiveWall}
          >
            <p className="tvwall-confirm-text">
              <FormattedMessage {...Messages.Text_TVWall_ConfirmClear} />
            </p>
          </Modal>
        </div>
        <div
          id="wall-screen"
          className="tvwall-screen-container"
          style={
            store.siderCollapse
              ? {
                  width: width - 463,
                  height: height - 262,
                  border: "1px solid #a5a5a5",
                  borderRadius: "8px",
                }
              : {
                  width: width - 615,
                  height: height - 262,
                  border: "1px solid #a5a5a5",
                  borderRadius: "8px",
                }
          }
        >
          <div style={{ position: "relative" }}>
            <TvWall
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
              selectedBlockNumber={selectedBlockNumber}
              setSelectedBlockNumber={setSelectedBlockNumber}
              setClearBlockNumber={setClearBlockNumber}
              blocksDetail={blocksDetail}
              setBlocksDetail={setBlocksDetail}
            />
          </div>
        </div>
      </div>
      <div className="tvwall-card-container">
        <Card className="tvwall-card-right">
          <div className="tvwall-title-column">
            <div className="tvwall-card-right-title">
              <FormattedMessage {...Messages.Text_TVWall_VideoSource} />
            </div>
            <div>
              <Button
                onClick={() => {
                  setShowPreview(!showPreview);
                }}
                style={{
                  marginTop: 6,
                  marginBottom: 12,
                  border: 0,
                  padding: 5,
                  boxShadow: "none",
                }}
              >
                <EyeOutlined style={{ fontSize: 16 }} />
              </Button>
            </div>
          </div>
          <div className="tvwall-card-right-desc">
            <FormattedMessage {...Messages.Text_TVWall_VideoSourceDesc} />
          </div>
          {showPreview ? (
            <div className="tvwall-card-right-preview">
              {selectedEncoder.nickName ? (
                <div>
                  <iframe
                    className="tvwall-card-right-preview-video"
                    src={selectedEncoder.previewUrl}
                    title="Video player"
                  />
                  <span>{selectedEncoder.nickName}</span>
                </div>
              ) : (
                <div className="tvwall-card-right-preview-text tvwall-card-right-preview-text ">
                  <FormattedMessage {...Messages.Text_TVWall_Preview} />
                </div>
              )}
            </div>
          ) : null}
          <Input
            className="tvwall-card-right-search tvwall-input"
            variant="filled"
            onChange={(e) => {
              setSearchFilter(e.target.value);
            }}
            prefix={<SearchOutlined />}
            placeholder={intl.formatMessage(Messages.Text_TVWall_InputEncoder)}
          />
          <div
            className={
              showPreview
                ? "tvwall-card-right-encoder-container"
                : "tvwall-card-right-encoder-container-without-preview"
            }
          >
            <Table
              columns={columns}
              size="small"
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
