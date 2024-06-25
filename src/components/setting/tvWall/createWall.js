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
import PlusIcon from "../../../assets/plus-white.png";
import XIcon from "../../../assets/X.png";
import "../../../App.scss";
import "./createWall.scss";

const CreateWall = ({ setReload }) => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wallId, setWallId] = useState(null);
  const [wallName, setWallName] = useState(null);
  const [wallSize, setWallSize] = useState({ col: 1, row: 1 });
  const [screenList, setScreenList] = useState([]);
  const [handledScreenList, setHandledScreenList] = useState([]);
  const [decoderOptions, setDecoderOptions] = useState([]);
  const [wallObj, setWallObj] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");

  // get decoders
  useEffect(() => {
    let tempDecoderOptions = [];
    (async () => {
      const decoders = await getDecoders(store);
      decoders?.forEach((decoder) => {
        if (decoder.nickName.includes(searchFilter))
          tempDecoderOptions.push({
            value: decoder.mac,
            label: decoder.nickName,
          });
      });
      setDecoderOptions(tempDecoderOptions);
    })();
  }, [searchFilter]);

  const resetWall = () => {
    setWallId(null);
    setWallName(null);
    setWallSize({ col: 1, row: 1 });
    setScreenList([]);
    setHandledScreenList([]);
  };

  useEffect(() => {
    resetWall();
  }, [isModalOpen]);

  useEffect(() => {
    // generate default screen list: [{number: 1, decoder: ""}, {number: 2, decoder: ""}, ...]
    setScreenList(
      Array.from({ length: wallSize.col * wallSize.row }, (v, i) => {
        return { num: i + 1, decoder: "", block: "" };
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
              ? "screen-block-handled"
              : "screen-block-default"
          }
          key={screen.num}
        >
          <span
            className={
              handledScreenList.includes(screen.num)
                ? "screen-block-text-handled"
                : "screen-block-text-default"
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
    list[screenNumber - 1] = { num: screenNumber, decoder: decoder };
    setScreenList(screenList);
  };

  const saveWall = () => {
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
  };

  const decoderTableColumns = [
    {
      title: (
        <span className="decoder-setting-table-head">
          {intl.formatMessage(Messages.Text_WallSetting_ScreenNumber)}
        </span>
      ),
      dataIndex: "num",
      key: "num",
      render: (text) => {
        return <span className="table-content">{text}</span>;
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
            setHandledScreenList([...handledScreenList, record.num]);
          }}
        />
      ),
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
        className="create-wall-modal modal-title"
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          resetWall();
          setIsModalOpen(false);
        }}
      >
        <div className="input-option-row">
          <div style={{ marginRight: 100 }}>
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
          </div>
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
          <div>
            <span className="input-title">
              <FormattedMessage {...Messages.Text_WallSetting_WallDimension} />
            </span>
            <div className="input-dimension-row">
              <InputNumber
                value={wallSize.col}
                min={1}
                max={5}
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
                max={4}
                onChange={(value) => setWallSize({ ...wallSize, row: value })}
                className="input-object input-dimension"
              />
            </div>
          </div>
        </div>
        <Divider className="divider" />
        <div className="screen-decoder-setting-title">
          <FormattedMessage {...Messages.Text_WallSetting_ScreenDecoder} />
        </div>
        <div className="screen-decoder-setting-desc">
          <FormattedMessage {...Messages.Text_WallSetting_ScreenDecoderDesc} />
        </div>
        <div className="screen-setting-row">
          <div>
            <table style={{ border: 0, borderCollapse: "collapse" }}>
              <tbody>{wallObj}</tbody>
            </table>
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
              pagination={false}
            />
          </div>
        </div>
        <div className="screen-setting-submit-row">
          <div>
            <Button
              type="text"
              onClick={resetWall}
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

export default CreateWall;
