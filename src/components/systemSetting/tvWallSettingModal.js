import { useEffect, useState } from "react";
import { Button, Modal, Row, Select, Typography } from "antd";
import {
  fakewall1,
  fakewall2,
  fakewall3,
  fakewall4,
  FAKE_WALLS,
  blockColorList,
} from "../../utils/Constant";
import "../../App.scss";

const TvWallSettingModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      </Button>
      <Modal
        title={"建立電視牆"}
        className="modal-title"
        width={568}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        區域選擇
        <Select></Select>
        <Row>電視牆清單</Row>{" "}
        {/* table -> sub row -> template -> remove/create template*/}
        <Row>建立電視牆</Row>
      </Modal>
    </div>
  );
};

export default TvWallSettingModal;
