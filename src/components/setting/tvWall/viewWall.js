import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../../components/store/store";
import { Button, Modal, Table, Select } from "antd";
import { getWallScreensById } from "../../../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../../messages";
import SearchIcon from "../../../assets/magnifying-glass.png";
import "../../../App.scss";
import "./tvWallSetting.scss";
import "./viewWall.scss";
import "./createWall.scss";

const ViewWall = ({ wall }) => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [screenList, setScreenList] = useState([]);
  const [wallObj, setWallObj] = useState(null);

  useEffect(() => {
    if (wall) {
      (async () => {
        const screens = await getWallScreensById(store, wall.wallId);
        setScreenList(screens);
      })();
    }
  }, [wall]);

  useEffect(() => {
    setModalOpen(modalOpen);
  }, [modalOpen]);

  useEffect(() => {
    // create wall table
    let tempRow = [];
    let tempWall = [];
    screenList?.forEach((screen) => {
      tempRow.push(
        <td
          className={
            screen.nickName ? "screen-block-handled" : "screen-block-default"
          }
          key={screen.num}
        >
          <span
            className={
              screen.nickName
                ? "screen-block-text-handled"
                : "screen-block-text-default"
            }
          >
            {screen.num}
          </span>
        </td>
      );
      if (tempRow.length === wall.col) {
        tempWall.push(<tr key={screen.num}>{tempRow}</tr>);
        tempRow = []; // clear row
      }
    });
    setWallObj(tempWall);
  }, [screenList]);

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
          value={record.nickName}
          className="decoder-setting-table-select"
          disabled
        />
      ),
    },
  ];

  return (
    <span>
      <Button
        key={`${wall.wallId}-edit`}
        id={wall.wallId}
        type="text"
        onClick={() => setModalOpen(true)}
        style={{ marginight: 6 }}
        className="table-content"
      >
        <img alt="edit" src={SearchIcon} className="table-content-icon" />
      </Button>
      <Modal
        title=<span className="view-wall-modal-title">
          {intl.formatMessage(Messages.Text_WallSetting_ViewWall)}
        </span>
        className="view-wall-modal view-wall-setting modal-title"
        open={modalOpen}
        footer={null}
        onCancel={() => {
          setModalOpen(false);
        }}
      >
        <div className="wall-info-block">
          <div className="wall-info-text">ID : {wall.wallId}</div>
          <div className="wall-info-text" style={{ marginTop: 8 }}>
            <FormattedMessage {...Messages.Text_Common_Name} />
            {" : "}
            {wall.wallName}
          </div>
          <div className="wall-info-text" style={{ marginTop: 8 }}>
            <FormattedMessage {...Messages.Text_Common_Dimension} />
            {" : "}
            {wall.col} x {wall.row}
          </div>
        </div>
        <div className="screen-setting-row">
          <div>
            <table style={{ border: 0, borderCollapse: "collapse" }}>
              <tbody>{wallObj}</tbody>
            </table>
          </div>
          <div className="decoder-setting-container">
            <Table
              className="view-decoder-setting-table"
              columns={decoderTableColumns}
              dataSource={screenList}
              pagination={false}
            />
          </div>
        </div>
      </Modal>
    </span>
  );
};

export default ViewWall;
