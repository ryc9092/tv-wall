import { useEffect, useState } from "react";
import { Button, Modal, Row, Select, Table, Typography } from "antd";
import {
  fakewall1,
  fakewall2,
  fakewall3,
  fakewall4,
  FAKE_WALLS,
  blockColorList,
} from "../../utils/Constant";
import { EditOutlined } from "@ant-design/icons";
import CreateTvWall from "../modals/createTvWall";
import ViewTvWall from "../modals/viewTvWall";
import "../../App.scss";

const TvWallSettingModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openViewWallModal, setOpenViewWallModal] = useState(false);
  const [selectedWall, setSelectedWall] = useState(null);
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
    {
      title: "版型設定",
      dataIndex: "name",
      key: "template",
      render: (text) => (
        <div key={`${text}-template`} style={{ width: 50 }}>
          <Button key={`${text}-template`} id={text} onClick={templateSetting}>
            設定
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

  const templateSetting = (e) => {
    console.log("template setting: ", e.currentTarget.id);
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
          <Select
            options={zones}
            defaultValue={"zone1"}
            style={{ width: "120px", marginRight: 8 }}
          />
          <CreateTvWall />
        </Row>
        <Table columns={columns} dataSource={data} style={{ width: "95%" }} />
        <ViewTvWall
          wall={selectedWall}
          modalOpen={openViewWallModal}
          setModalOpen={setOpenViewWallModal}
        />
      </Modal>
    </div>
  );
};

export default TvWallSettingModal;
