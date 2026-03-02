import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Actions } from "../components/store/reducer";
import { Select, Modal } from "antd";
import MultiView from "../components/multiview/multiview";
import EncoderCard from "../components/tvwall/encoderCard";
import {
  activeWall,
  deactiveWall,
  getActivedWall,
  getWalls,
  getTemplates,
  getDecoders,
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

const Multiview = () => {
  const intl = useIntl();
  const [store, dispatch] = useContext(StoreContext);
  const { width, height } = useWindowDimensions();
  const [decoderOptions, setDecoderOptions] = useState([]);
  const [wallDimension, setWallDimension] = useState({ col: 0, row: 0 });
  const [selectedWall, setSelectedWall] = useState({});
  const [templateOptions, setTemplateOptions] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedBlockNumber, setSelectedBlockNumber] = useState(null);
  const [clearBlockNumber, setClearBlockNumber] = useState(null);
  const [encoders, setEncoders] = useState([]);
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

  // Set "wall options", get encoders
  useEffect(() => {
    (async () => {
      let tempDecoderOptions = [];
      const result = await getDecoders(store); // todo: 改成multiview專用get decoder API
      console.log(result, "=====");
      if (result) {
        result.forEach((decoder) => {
          tempDecoderOptions.push({
            value: decoder.mac,
            label: decoder.nickName,
            col: 1,
            row: 1,
            monitorbrand: "test",
            wallId: "1",
            wallName: "1",
            ...decoder,
          });
        });
        setDecoderOptions(tempDecoderOptions);
        setSelectedWall(tempDecoderOptions[0]);
      }
      const encoders = await getEncoders(store);
      setEncoders(encoders);
    })();
  }, [store.vars]);

  const templates = [
    {
      value: "1x1",
      label: "全畫面",
      id: "1x1",
      groupId: "-1",
      templateId: "1x1",
      templateName: "1x1",
      col: 1,
      row: 1,
      isDefault: 0,
      screens: null,
    },
    {
      value: "2x2",
      label: "四分割",
      id: "2x2",
      groupId: "-1",
      templateId: "2x2",
      templateName: "2x2",
      col: 2,
      row: 2,
      isDefault: 0,
      screens: null,
    },
  ];

  // Set template when selected wall is changed
  useEffect(() => {
    (async () => {
      let tempTemplateOptions = [];
      if (templates) {
        templates.forEach((template) => {
          tempTemplateOptions.push({
            value: template.templateName,
            label: template.templateName,
            id: template.templateId,
            ...template,
          });
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
          intl.formatMessage(Messages.Text_TVWall_ProjectVideoSuccess, {
            source: selectedEncoder.nickName,
            destination: selectedWall.label,
            block: selectedBlockNumber,
          }),
          Math.random(),
        );
      } else {
        showWarningNotification(
          <span>
            {intl.formatMessage(Messages.Text_TVWall_ProjectVideoFail, {
              source: selectedEncoder.nickName,
              destination: selectedWall.label,
              block: selectedBlockNumber,
            })}
            <br />
            {intl.formatMessage(Messages.Text_TVWall_ProjectVideoFailHint)}
          </span>,
          Math.random(),
        );
      }
      setSelectedBlockNumber(null);
      // setSelectedEncoder({
      //   nickName: "",
      //   mac: "",
      //   previewUrl: "",
      // });
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
          let apiFormatBlocks = [];
          blocksDetail?.forEach((block) => {
            if (clearBlockNumber === block.block.toString()) {
              block.detail?.forEach((detail) => {
                unlinkDecoders.push(detail.decoder);
              });
            }
            apiFormatBlocks.push({
              block: block.block,
              col: block.col,
              row: block.row,
              // update block to not link encoder
              encoder:
                clearBlockNumber === block.block.toString()
                  ? ""
                  : block.detail[0].encoder,
            });
          });
          const result = await deactiveWall({
            activeId: selectedWall.wallId,
            store: store,
            data: {
              active: apiFormatBlocks,
              leave: unlinkDecoders,
            },
          });
          if (!result) throw new Error("call api failed");
          else {
            showSuccessNotificationByMsg(
              intl.formatMessage(Messages.Text_TVWall_DeactiveBlockSuccess, {
                source: selectedEncoder.nickName,
                destination: selectedWall.label,
                block: clearBlockNumber,
              }),
              Math.random(),
            );
            setClearBlockNumber(null);
            setReload(Math.random());
          }
        } catch (error) {
          showWarningNotification(
            <span>
              {intl.formatMessage(Messages.Text_TVWall_DeactiveBlockFail, {
                source: selectedEncoder.nickName,
                destination: selectedWall.label,
                block: clearBlockNumber,
              })}
              <br />
              {intl.formatMessage(Messages.Text_TVWall_DeactiveBlockFailHint)}
            </span>,
            Math.random(),
          );
        }
      }
    })();
  }, [clearBlockNumber, intl, selectedWall]);

  const changeWallSelected = (wall) => {
    setWallDimension({ col: wall.col, row: wall.row });
    setSelectedWall(wall);
  };

  const changeTemplateSelected = (template) => {
    setSelectedTemplate(template);
  };

  const handleDeactiveWall = async () => {
    try {
      const result = await deactiveWall({
        activeId: selectedWall.wallId,
        store: store,
        data: {
          active: [],
          leave: [],
        },
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
        intl.formatMessage(Messages.Text_TVWall_DeactiveSuccess, {
          destination: selectedWall.label,
        }),
        Math.random(),
      );
    } catch (error) {
      showWarningNotification(
        <span>
          {intl.formatMessage(Messages.Text_TVWall_DeactiveFail, {
            destination: selectedWall.label,
          })}
          <br />
          {intl.formatMessage(Messages.Text_TVWall_DeactiveFailHint)}
        </span>,
        Math.random(),
      );
    }
    setOpenConfirmModal(false);
  };

  return (
    <div className="page-layout-column">
      <div>
        <div className="page-title">
          <FormattedMessage {...Messages.Text_Multiview_MultiviewManagement} />
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
              <FormattedMessage {...Messages.Text_Multiview_EncoderChoose} />
            </span>
            <Select
              className="tvwall-option-select"
              options={decoderOptions}
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
              <FormattedMessage {...Messages.Text_Multiview_MultiviewTemplate} />
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
                  // border: "1px solid #a5a5a5",
                  // borderRadius: "8px",
                }
              : {
                  width: width - 614,
                  height: height - 258,
                  // border: "1px solid #a5a5a5",
                  // borderRadius: "8px",
                }
          }
        >
          <div style={{ position: "relative" }}>
            <MultiView
              selectedWall={selectedWall}
              selectedTemplate={selectedTemplate}
              selectedEncoder={selectedEncoder}
              encoders={encoders}
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
      <EncoderCard
        encoders={encoders}
        selectedEncoder={selectedEncoder}
        setSelectedEncoder={setSelectedEncoder}
      />
    </div>
  );
};

export default Multiview;
