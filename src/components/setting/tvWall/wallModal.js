import { useEffect, useState } from "react";
import { Button, Modal, Row, Select, Table, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import CreateWall from "./createWall";
import ViewWall from "./viewWall";
import { getWalls, deleteWall } from "../../../api/API";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
} from "../../../utils/Utils";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../../messages";
import "../../../App.scss";

const SettingWallModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWall, setSelectedWall] = useState(null);
  const [openViewWallModal, setOpenViewWallModal] = useState(false);
  const [walls, setWalls] = useState([]);
  const [reload, setReload] = useState(null);

  useEffect(() => {
    (async () => {
      let tempWalls = [];
      const result = await getWalls();
      result.forEach((wall) => {
        wall.key = wall.wallId;
        tempWalls.push(wall);
      });
      setWalls(tempWalls);
    })();
  }, [reload]);

  const zones = [
    {
      value: "zone1",
      label: "區域1",
    },
  ];

  const columns = [
    {
      title: "ID",
      dataIndex: "wallId",
      key: "wallId",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "名稱",
      dataIndex: "wallName",
      key: "wallName",
    },
    {
      title: "維度",
      dataIndex: ["col", "row"],
      key: "dimension",
      render: (text, record) => <span>{`${record.col} X ${record.row}`}</span>,
    },
    {
      title: "操作",
      dataIndex: "wallId",
      key: "action",
      render: (text) => (
        <div key={`${text}-action`}>
          <Button
            key={`${text}-edit`}
            id={text}
            onClick={viewWall}
            style={{ marginRight: 6 }}
          >
            檢視
          </Button>
          <Button key={`${text}-delete`} id={text} onClick={removeWall}>
            刪除
          </Button>
        </div>
      ),
    },
  ];

  const removeWall = (e) => {
    console.log("remove wall: ", e.currentTarget.id);
    (async () => {
      const result = await deleteWall();
      if (result) {
        showSuccessNotificationByMsg("電視牆移除成功");
        setReload(Math.random);
      } else showWarningNotification("電視牆移除失敗");
    })();
  };

  const viewWall = (e) => {
    let wallId = e.currentTarget.id;
    walls.forEach((wall) => {
      if (wall.wallId === wallId) {
        setOpenViewWallModal(true);
        setSelectedWall(wall);
      }
    });
  };

  return (
    <div>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="setting-option-button"
      >
        <Typography.Text className="setting-option-text">
          電視牆設定
        </Typography.Text>
        <></>
        <EditOutlined className="setting-option-icon" />
      </Button>
      <Modal
        title={"電視牆設定"}
        className="modal-title"
        width={658}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <Row style={{ marginTop: 16, marginBottom: 12 }}>
          {/* <Select
            options={zones}
            defaultValue={"zone1"}
            style={{ width: "120px", marginRight: 8 }}
          /> */}
          <CreateWall setReload={setReload} />
        </Row>
        <Table columns={columns} dataSource={walls} style={{ width: "95%" }} />
        <ViewWall
          wall={selectedWall}
          modalOpen={openViewWallModal}
          setModalOpen={setOpenViewWallModal}
        />
      </Modal>
    </div>
  );
};

export default SettingWallModal;
