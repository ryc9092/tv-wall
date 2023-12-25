import { useState } from "react";
import { Button, Modal, Row, Select, Table, Typography } from "antd";
import { FAKE_WALLS } from "../../../utils/Constant";
import { EditOutlined } from "@ant-design/icons";
import CreateWall from "./createWall";
import ViewWall from "./viewWall";
import "../../../App.scss";

const SettingWallModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWall, setSelectedWall] = useState(null);
  const [openViewWallModal, setOpenViewWallModal] = useState(false);
  const data = FAKE_WALLS;

  const zones = [
    {
      value: "zone1",
      label: "區域1",
    },
  ];

  const columns = [
    {
      title: "名稱",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "維度",
      dataIndex: "dimension",
      key: "dimension",
      render: (dimension) => (
        <span>{`${dimension.col} X ${dimension.row}`}</span>
      ),
    },
    {
      title: "操作",
      dataIndex: "name",
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
  };

  const viewWall = (e) => {
    let wallName = e.currentTarget.id;
    FAKE_WALLS.forEach((wall) => {
      if (wall.name === wallName) {
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
          <CreateWall />
        </Row>
        <Table columns={columns} dataSource={data} style={{ width: "95%" }} />
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
