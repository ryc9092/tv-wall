import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store";
import { Button, Table } from "antd";
import CreateWall from "./createWall";
import ViewWall from "./viewWall";
import { getWalls, deleteWall, getWallScreensById } from "../../../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../../messages";
import TrashIcon from "../../../assets/trash.png";
import "./tvWallSetting.scss";
import "../../../App.scss";

const TVWallSetting = () => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [walls, setWalls] = useState([]);
  const [reload, setReload] = useState(null);

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
      render: (text, record) => (
        <span className="table-content">{`${record.col} X ${record.row}`}</span>
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
            {/* <ViewWall wall={record} /> */}
            <Button
              // key={`${wall.wallId}-edit`}
              // id={wall.wallId}
              // type="text"
              // onClick={() => setModalOpen(true)}
              // style={{ marginight: 6 }}
              // className="table-content"
              onClick={()=>{
                console.log(record)
                setSelectedWall(record);
              }}
            >
              {/* <img alt="edit" src={SearchIcon} className="table-content-icon" /> */}
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
  // const [screenList, setScreenList] = useState([]);
  // const [wallObj, setWallObj] = useState(null);

  //   useEffect(() => {
  //     if (selectedWall) {
  //       (async () => {
  //         const screens = await getWallScreensById(store, selectedWall.wallId);
  //         setScreenList(screens);
  //       })();
  //     }
  //   }, [selectedWall]);
  
  //   useEffect(() => {
  //     // create wall table
  //     let tempRow = [];
  //     let tempWall = [];
  //     screenList?.forEach((screen) => {
  //       tempRow.push(
  //         <td
  //           className={
  //             screen.nickName ? "screen-block-handled" : "screen-block-default"
  //           }
  //           key={screen.num}
  //         >
  //           <span
  //             className={
  //               screen.nickName
  //                 ? "screen-block-text-handled"
  //                 : "screen-block-text-default"
  //             }
  //           >
  //             {screen.num}
  //           </span>
  //         </td>
  //       );
  //       if (tempRow.length === selectedWall.col) {
  //         tempWall.push(<tr key={screen.num}>{tempRow}</tr>);
  //         tempRow = []; // clear row
  //       }
  //     });
  //     setWallObj(tempWall);
  //   }, [screenList]);

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
          <Table columns={columns} dataSource={walls} />
        </div>
        <div
          className={
            store.siderCollapse
              ? "wall-setting-table-container-collapse"
              : "wall-setting-table-container"
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
          {/* <div>{wallObj}</div> */}
          {/* <Table columns={columns} dataSource={walls} /> */}
        </div>
      </div>
    </div>
  );
};

export default TVWallSetting;
