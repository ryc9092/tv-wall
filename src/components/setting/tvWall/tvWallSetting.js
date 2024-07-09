import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store";
import { Button, Table } from "antd";
import CreateWall from "./createWall";
import ViewWall from "./viewWall";
import { getWalls, deleteWall } from "../../../api/API";
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
  }, [reload]);

  const columns = [
    {
      title: <span className="table-head">ID</span>,
      dataIndex: "wallId",
      key: "wallId",
      render: (text) => <span className="table-content">{text}</span>,
    },
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_Common_Name)}
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
            <ViewWall wall={record} />
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

  const removeWall = (wall) => {
    (async () => {
      const result = await deleteWall(wall.wallId, store);
      if (result) {
        setReload(Math.random());
      }
    })();
  };

  return (
    <div className="content-container">
      <div className="title-row">
        <div className="page-title">
          <FormattedMessage {...Messages.Text_WallSetting_WallSetting} />
        </div>
        <CreateWall setReload={setReload} />
      </div>
      <div className="table-container ">
        <Table columns={columns} dataSource={walls} />
      </div>
    </div>
  );
};

export default TVWallSetting;
