import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../../components/store/store";
import {
  Button,
  Divider,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getDecoders, createWall } from "../../../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../../messages";
import { showWarningNotification } from "../../../utils/Utils";
import PlusIcon from "../../../assets/plus-white.png";
import XIcon from "../../../assets/X.png";
import ClearLinkIcon from "../../../assets/clearLinkIconRed.png";
import "../../../App.scss";
import "./createWall.scss";

import useWindowDimensions from "../../../utils/WindowDimension";

const CreateWall = ({ setReload }) => {
  const intl = useIntl();
  const { width, height } = useWindowDimensions();
  const [store] = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wallId, setWallId] = useState(null);
  const [wallName, setWallName] = useState(null);
  const [wallSize, setWallSize] = useState({ col: 1, row: 1 });
  const [screenList, setScreenList] = useState([]);
  const [handledScreenList, setHandledScreenList] = useState([]);
  const [reloadDecoder, setReloadDecoder] = useState(null);
  const [decoderOptions, setDecoderOptions] = useState([]);
  const [wallObj, setWallObj] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  // get decoders
  useEffect(() => {
    // get set decoders from screen list
    let selectedDecoders = [];
    screenList?.forEach((screen) => {
      if (screen.decoder) selectedDecoders.push(screen.decoder);
    });

    let tempDecoderOptions = [];
    (async () => {
      const decoders = await getDecoders(store);
      decoders?.forEach((decoder) => {
        if (
          decoder.nickName.includes(searchFilter) &&
          !selectedDecoders.includes(decoder.mac)
        )
          tempDecoderOptions.push({
            value: decoder.mac,
            label: decoder.nickName,
          });
      });
      setDecoderOptions(tempDecoderOptions);
    })();
  }, [searchFilter, reloadDecoder]);

  const resetWall = () => {
    setWallId(null);
    setWallName(null);
    setWallSize({ col: 1, row: 1 });
    setScreenList([]);
    setHandledScreenList([]);
    setConfirmText("");
    setReloadDecoder(null);
  };

  useEffect(() => {
    resetWall();
  }, [isModalOpen]);

  useEffect(() => {
    // generate default screen list: [{number: 1, decoder: ""}, {number: 2, decoder: ""}, ...]
    setScreenList(
      Array.from({ length: wallSize.col * wallSize.row }, (v, i) => {
        if (screenList[i] !== undefined) return screenList[i];
        else return { num: i + 1, decoder: "", block: "", ip: "" };
      })
    );
  }, [wallSize]);

  useEffect(() => {
    // create wall table
    let tempRow = [];
    let tempWall = [];
    screenList.forEach((screen) => {
      tempRow.push(
        <td
          className={
            handledScreenList.includes(screen.num)
              ? "create-wall-screen-block-handled"
              : "create-wall-screen-block-default"
          }
          key={screen.num}
        >
          <span
            className={
              handledScreenList.includes(screen.num)
                ? "create-wall-screen-block-text-handled"
                : "create-wall-screen-block-text-default"
            }
          >
            {screen.num}
          </span>
        </td>
      );
      if (tempRow.length === wallSize.col) {
        tempWall.push(<tr key={screen.num}>{tempRow}</tr>);
        tempRow = []; // clear row
      }
    });
    setWallObj(tempWall);
  }, [screenList, handledScreenList]);

  const setScreenDecoder = ({ screenNumber, decoder }) => {
    let list = screenList;
    list[screenNumber - 1] = {
      ...screenList[screenNumber - 1],
      decoder: decoder,
    };
    setScreenList(screenList);
  };

  const setScreenIP = ({ screenNumber, ip }) => {
    let list = screenList;
    list[screenNumber - 1] = { ...screenList[screenNumber - 1], ip: ip };
    setScreenList(screenList);
  };

  const saveWall = () => {
    let wallId = `wall${Math.random().toString().substring(0, 6)}`;
    if (wallId && wallName && wallSize && screenList?.length !== 0) {
      (async () => {
        const result = await createWall(
          store,
          wallId,
          wallName,
          wallSize.col,
          wallSize.row,
          screenList
        );
        if (result) {
          setReload(Math.random());
          setIsModalOpen(false);
        }
      })();
    } else {
      showWarningNotification(
        intl.formatMessage(Messages.Text_Common_RequiredHint)
      );
    }
  };

  const decoderTableColumns = [
    {
      title: (
        <span className="decoder-setting-table-head" style={{ maxWidth: 30 }}>
          {intl.formatMessage(Messages.Text_WallSetting_ScreenNumber)}
        </span>
      ),
      width: "20%",
      dataIndex: "num",
      key: "num",
      render: (text) => {
        return (
          <span className="table-content" style={{ maxWidth: 30 }}>
            {text}
          </span>
        );
      },
    },
    {
      title: (
        <span className="decoder-setting-table-head">
          {intl.formatMessage(Messages.Text_WallSetting_DestinationName)}
        </span>
      ),
      dataIndex: "num",
      key: "select",
      render: (text, record) => (
        <Select
          options={decoderOptions}
          className="decoder-setting-table-select"
          onChange={(value, option) => {
            setScreenDecoder({
              screenNumber: record.num,
              decoder: value,
            });
            if (
              screenList[record.num - 1].decoder !== "" &&
              screenList[record.num - 1].ip !== ""
            )
              setHandledScreenList([...handledScreenList, record.num]);
            setReloadDecoder(Math.random());
          }}
        />
      ),
    },
    {
      title: <span className="decoder-setting-table-head">IP</span>,
      dataIndex: "num",
      key: "num",
      render: (text, record) => {
        return (
          <Input
            className="table-content"
            onChange={(value, option) => {
              setScreenIP({
                screenNumber: record.num,
                ip: value.currentTarget.value,
              });
              if (
                screenList[record.num - 1].decoder !== "" &&
                screenList[record.num - 1].ip !== ""
              )
                setHandledScreenList([...handledScreenList, record.num]);
              setReloadDecoder(Math.random());
            }}
          />
        );
      },
    },
  ];

  return (
    <div>
      <Button className="create-wall-btn" onClick={() => setIsModalOpen(true)}>
        <img alt="create" src={PlusIcon} className="create-wall-btn-icon" />
        <span className="create-wall-btn-text">
          <FormattedMessage {...Messages.Text_WallSetting_CreateWall} />
        </span>
      </Button>
      <Modal
        title=<span className="create-wall-modal-title">
          {intl.formatMessage(Messages.Text_WallSetting_CreateWall)}
        </span>
        className="create-wall-modal create-wall-modal-close-icon create-wall-setting modal-title"
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          resetWall();
          setIsModalOpen(false);
        }}
      >
        <div className="create-wall-input-option-row">
          {/* <div style={{ marginRight: 100 }}>
            <span className="input-title">
              <FormattedMessage {...Messages.Text_WallSetting_WallID} />
            </span>
            <Input
              value={wallId}
              className="input-object"
              placeholder={intl.formatMessage(Messages.Text_Common_InputID)}
              onChange={(e) => {
                setWallId(e.target.value);
              }}
            />
          </div> */}
          <div style={{ marginRight: 100 }}>
            <span className="input-title">
              <FormattedMessage {...Messages.Text_WallSetting_WallName} />
            </span>
            <Input
              value={wallName}
              className="input-object"
              placeholder={intl.formatMessage(Messages.Text_Common_InputName)}
              onChange={(e) => {
                setWallName(e.target.value);
              }}
            />
          </div>
          <div style={{ marginRight: 100 }}>
            <span className="input-title">
              <FormattedMessage {...Messages.Text_WallSetting_WallDimension} />
            </span>
            <div className="input-dimension-row">
              <InputNumber
                value={wallSize.col}
                min={1}
                max={15}
                onChange={(value) => setWallSize({ ...wallSize, col: value })}
                className="input-object input-dimension"
              />
              <img
                alt="x"
                src={XIcon}
                className="input-dimension-multiply-icon"
              />
              <InputNumber
                value={wallSize.row}
                min={1}
                max={15}
                onChange={(value) => setWallSize({ ...wallSize, row: value })}
                className="input-object input-dimension"
              />
            </div>
          </div>
          <div>
            <span className="input-title">
              <FormattedMessage {...Messages.Text_WallSetting_WallBrand} />
            </span>
            <div className="input-dimension-row">
              <Select className="input-object wall-setting-brand-select" />
            </div>
          </div>
        </div>
        <Divider className="create-wall-divider" />
        <div className="screen-decoder-setting-title">
          <FormattedMessage {...Messages.Text_WallSetting_ScreenDecoder} />
        </div>
        <div className="screen-decoder-setting-desc">
          <FormattedMessage {...Messages.Text_WallSetting_ScreenDecoderDesc} />
        </div>
        <div className="create-wall-screen-setting-row">
          <div
            style={{
              border: "1px solid #d4d4d4",
              borderRadius: 12,
              padding: 6,
              width: 500,
              height: 375,
            }}
          >
            <div style={{ width: 498, height: 375, overflow: "auto" }}>
              <table style={{ border: 0, borderCollapse: "collapse" }}>
                <tbody>{wallObj}</tbody>
              </table>
            </div>
          </div>
          <div className="decoder-setting-container">
            <Input
              className="decoder-setting-input setting-input"
              variant="filled"
              onChange={(e) => {
                setSearchFilter(e.target.value);
              }}
              prefix={<SearchOutlined />}
              placeholder={intl.formatMessage(
                Messages.Text_WallSetting_InputDecoder
              )}
            />
            <Table
              className="decoder-setting-table"
              columns={decoderTableColumns}
              dataSource={screenList}
              size="small"
              pagination={false}
              scroll={{ x: "max-content", y: 300 }}
            />
          </div>
        </div>
        <div className="create-wall-screen-setting-submit-row">
          <div>
            <Button
              type="text"
              onClick={resetWall}
              className="create-wall-screen-setting-clear-btn"
            >
              <img
                alt="remove"
                src={ClearLinkIcon}
                className="create-wall-clear-icon"
              />
              <span className="create-wall-screen-setting-clear-btn-text">
                <FormattedMessage {...Messages.Text_Button_ClearAll} />
              </span>
            </Button>
          </div>
          <div>
            <Button
              onClick={() => {
                let hasEmptyScreenDecoder = false;
                let hasEmptyScreenIP = false;
                screenList.forEach((screen) => {
                  if (screen.decoder === "") hasEmptyScreenDecoder = true;
                  if (screen.ip === "") hasEmptyScreenIP = true;
                });
                if (!wallName) setConfirmText("WallName");
                else if (hasEmptyScreenDecoder) setConfirmText("Decoder");
                else if (hasEmptyScreenIP) setConfirmText("IP");
                if (!wallName || hasEmptyScreenDecoder || hasEmptyScreenIP)
                  setOpenConfirmModal(true);
                else saveWall();
              }}
              className="create-wall-screen-setting-create-btn"
            >
              <span className="screen-setting-create-btn-text">
                <FormattedMessage {...Messages.Text_Button_Create} />
              </span>
            </Button>
            <Modal
              className="audio-modal-close-x"
              title={
                <span style={{ marginRight: 12 }}>
                  {confirmText === "WallName" ? (
                    <FormattedMessage
                      {...Messages.Text_WallSetting_CreateWallConfirmWallName}
                    />
                  ) : confirmText === "Decoder" ? (
                    <FormattedMessage
                      {...Messages.Text_WallSetting_CreateWallConfirmDecoder}
                    />
                  ) : (
                    <FormattedMessage
                      {...Messages.Text_WallSetting_CreateWallConfirmIP}
                    />
                  )}
                </span>
              }
              width={400}
              okText={intl.formatMessage(Messages.Text_Common_Confirm)}
              cancelText={intl.formatMessage(Messages.Text_Button_Cancel)}
              open={openConfirmModal}
              onCancel={() => {
                setOpenConfirmModal(false);
              }}
              onOk={() => {
                if (!confirmText === "WallName") saveWall();
                setOpenConfirmModal(false);
              }}
            >
              <br />
            </Modal>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateWall;
