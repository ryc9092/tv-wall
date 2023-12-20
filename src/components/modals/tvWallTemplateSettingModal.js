import { useEffect, useState } from "react";
import { Button, Modal, Row, Select, Table, Typography } from "antd";
import {
  fakewall1,
  fakewall2,
  fakewall3,
  fakewall4,
  FAKE_WALLS,
  FAKE_TEMPLATES,
  blockColorList,
} from "../../utils/Constant";
import CreateTvWallTemplate from "../modals/createTvWallTemplate";
import "../../App.scss";

const TvWallTemplateSettingModal = ({ wall, modalOpen, setModalOpen }) => {
  const [openViewWallModal, setOpenViewWallModal] = useState(false);
  const [selectedWall, setSelectedWall] = useState(null);
  const data = FAKE_TEMPLATES;

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
      <Modal
        title={`${wall?.name} 版型設定`}
        className="modal-title"
        width={580}
        open={modalOpen}
        footer={null}
        onCancel={() => {
          setModalOpen(false);
        }}
      >
        <Row style={{ marginTop: 16, marginBottom: 12 }}>
          <CreateTvWallTemplate wall={wall} />
        </Row>
        <Table columns={columns} dataSource={data} style={{ width: "95%" }} />
      </Modal>
    </div>
  );
};

export default TvWallTemplateSettingModal;
