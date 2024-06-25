import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store";
import { Button, Modal, Row, Select, Table, Typography } from "antd";
import CreateWall from "./createWall";
import { getWalls, deleteWall } from "../../../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../../messages";
import PlusIcon from "../../../assets/plus-white.png";
import PencilIcon from "../../../assets/pencil.png";
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
        result.forEach((wall) => {
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
      render: (text) => (
        <div key={`${text}-action`}>
          <Button
            key={`${text}-edit`}
            id={text}
            type="text"
            onClick={editWall}
            style={{ marginight: 6 }}
            className="table-content"
          >
            <img alt="edit" src={PencilIcon} className="table-content-icon" />
          </Button>
          <Button
            key={`${text}-delete`}
            id={text}
            type="text"
            onClick={removeWall}
            className="table-content"
          >
            <img alt="remove" src={TrashIcon} className="table-content-icon" />
          </Button>
        </div>
      ),
    },
  ];

  const editWall = () => {};

  const removeWall = () => {};

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
