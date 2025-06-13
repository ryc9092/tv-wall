import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store";
import { Actions } from "../../store/reducer";
import { Button, Table } from "antd";
import CreateWall from "./createWall";
import { getWalls, deleteWall, getWallScreensById } from "../../../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../../messages";
import TrashIcon from "../../../assets/trash.png";
import SearchIcon from "../../../assets/magnifying-glass.png";
import "./tvWallSetting.scss";
import "./createWall.scss";
import "./viewWall.scss";
import "../../../App.scss";

import useWindowDimensions from "../../../utils/WindowDimension";

const TVWallSetting = () => {
  const intl = useIntl();
  const { width, height } = useWindowDimensions();
  const [store, dispatch] = useContext(StoreContext);
  const [walls, setWalls] = useState([]);
  const [reload, setReload] = useState(null);

  useEffect(() => {
    if (width < 1240)
      dispatch({ type: Actions.SetSiderCollapse, payload: true });
  }, [dispatch, width]);

  useEffect(() => {
    (async () => {
      let tempWalls = [];
      const result = await getWalls(store);
      if (result) {
        result?.forEach((wall) => {
          wall.key = wall.wallId;
          tempWalls.push(wall);
        });
      }
      setWalls(tempWalls);
      setSelectedWall(tempWalls.length > 0 ? tempWalls[0] : null);
    })();
  }, [reload, store]);

  const columns = [
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_WallSetting_WallName)}
        </span>
      ),
      dataIndex: "wallName",
      key: "wallName",
      render: (text) => {
        return <span className="table-content">{text}</span>;
      },
    },
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_Common_Dimension)}
        </span>
      ),
      dataIndex: ["col", "row"],
      key: "dimension",
      sorter: (a, b) => a.col - b.col,
      render: (text, record) => (
        <span className="table-content">{`${record?.col} X ${record?.row}`}</span>
      ),
    },
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_Button_Operation)}
        </span>
      ),
      dataIndex: "wallId",
      key: "action",
      render: (text, record) => {
        return (
          <div key={`${text}-action`}>
            <Button
              key={`${record.wallId}-edit`}
              id={record.wallId}
              type="text"
              style={{ marginight: 6 }}
              className="table-content"
              onClick={() => {
                setSelectedWall(record);
              }}
            >
              <img alt="edit" src={SearchIcon} className="table-content-icon" />
            </Button>
            <Button
              key={`${text}-delete`}
              id={text}
              type="text"
              onClick={() => {
                removeWall(record);
              }}
              className="table-content"
            >
              <img
                alt="remove"
                src={TrashIcon}
                className="table-content-icon"
              />
            </Button>
          </div>
        );
      },
    },
  ];

  const [selectedWall, setSelectedWall] = useState(null);
  const [screenList, setScreenList] = useState([]);
  const [wallObj, setWallObj] = useState(null);

  useEffect(() => {
    if (selectedWall) {
      (async () => {
        const screens = await getWallScreensById(store, selectedWall.wallId);
        setScreenList(screens);
      })();
    }
  }, [selectedWall]);

  useEffect(() => {
    // create wall table
    let tempRow = [];
    let tempWall = [];
    screenList?.forEach((screen) => {
      tempRow.push(
        <td className="wall-setting-screen-block" key={screen.num}>
          {/* <div>
            {intl.formatMessage(Messages.Text_Common_Block)}
            {": "}
            {screen.block}
          </div> */}
          <div className="wall-setting-screen-block-content">
            <div style={{ marginBottom: 8, textOverflow: "ellipsis" }}>
              <span style={{ fontWeight: 600 }}>
                {intl.formatMessage(Messages.Text_Common_Decoder)}
                {":"}
              </span>
              <br />
              {screen?.nickName ? (
                screen.nickName
              ) : (
                <span
                  style={{
                    color: "#e7e7e7",
                    // lineHeight: 22,
                    content: " ",
                    whiteSpace: "pre",
                  }}
                >
                  {" "}
                </span>
              )}
            </div>
            <div style={{ marginBottom: 8, textOverflow: "ellipsis" }}>
              <span style={{ fontWeight: 600 }}>
                {intl.formatMessage(Messages.Text_DeviceSetting_TVIP)}
                {":"}
              </span>
              <br />
              {screen?.ip ? (
                screen.ip
              ) : (
                <span
                  style={{
                    color: "#e7e7e7",
                    // lineHeight: 22,
                    content: " ",
                    whiteSpace: "pre",
                  }}
                >
                  {" "}
                </span>
              )}
            </div>
            {/* <div style={{ textOverflow: "ellipsis" }}>
              <span style={{ fontWeight: 600 }}>
                {intl.formatMessage(Messages.Text_DeviceSetting_TVBrand)}
                {":"}
              </span>
              <br />
              {screen?.monitorBrandName ? (
                screen.monitorBrandName
              ) : (
                <span
                  style={{
                    color: "#e7e7e7",
                    // lineHeight: 22,
                    content: " ",
                    whiteSpace: "pre",
                  }}
                >
                  {" "}
                </span>
              )}
            </div> */}
          </div>
        </td>
      );
      if (tempRow.length === selectedWall?.col) {
        tempWall.push(<tr key={screen.num}>{tempRow}</tr>);
        tempRow = []; // clear row
      }
    });
    setWallObj(tempWall);
  }, [screenList, selectedWall]);

  const removeWall = (wall) => {
    (async () => {
      const result = await deleteWall(wall.wallId, store);
      if (result) {
        setReload(Math.random());
      }
    })();
  };

  return (
    <div
      className={
        store.siderCollapse
          ? "tv-wall-content-container-collapse"
          : "tv-wall-content-container"
      }
    >
      <div className="wall-setting-title-row">
        <div className="page-title">
          <FormattedMessage {...Messages.Text_WallSetting_WallSetting} />
        </div>
        <CreateWall setReload={setReload} />
      </div>
      <div className="table-row">
        <div
          className={
            store.siderCollapse
              ? "wall-setting-table-container-collapse"
              : "wall-setting-table-container"
          }
        >
          <Table
            columns={columns}
            dataSource={walls}
            // size="small"
            scroll={{ x: "max-content", y: height - 365 }}
          />
        </div>
        <div
          className={
            store.siderCollapse
              ? "wall-setting-screen-container-collapse"
              : "wall-setting-screen-container"
          }
        >
          <div
            style={{
              backgroundColor: "#FAFAFA",
              height: 56,
              borderRadius: 8,
              textAlign: "center",
              paddingTop: 20,
              color: "#A5A5A5",
            }}
          >
            <FormattedMessage {...Messages.Text_WallSetting_Preview} />
          </div>
          <div className="wall-setting-screen-block-container">{wallObj}</div>
        </div>
      </div>
    </div>
  );
};

export default TVWallSetting;
