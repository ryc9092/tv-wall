import { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Table, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PresetWallModal from "./presetWallModal";
import PresetSingleScreenModal from "./presetSingleScreenModal";
import PresetAudioModal from "./presetAudioModal";
import PresetUSBModal from "./presetUSBModal";
import "./addSituationContent.scss";

const AddSituationContentModal = ({
  id,
  detailsNum,
  setReloadPresetDetails,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemList = [
    <PresetWallModal
      key="wall"
      situationId={id}
      openParentModal={setIsModalOpen}
      setReloadPresetDetails={setReloadPresetDetails}
      detailsNum={detailsNum}
    />,
    <PresetSingleScreenModal
      key="screen"
      situationId={id}
      openParentModal={setIsModalOpen}
      setReloadPresetDetails={setReloadPresetDetails}
      detailsNum={detailsNum}
    />,
    <PresetAudioModal
      key="audio"
      situationId={id}
      openParentModal={setIsModalOpen}
      setReloadPresetDetails={setReloadPresetDetails}
      detailsNum={detailsNum}
    />,
    <PresetUSBModal
      key="usb"
      situationId={id}
      openParentModal={setIsModalOpen}
      setReloadPresetDetails={setReloadPresetDetails}
      detailsNum={detailsNum}
    />,
  ];

  let functionItems = [];
  itemList.forEach((item) => {
    functionItems.push(
      <Col key={`col.${item.key}`} className="situation-option-block">
        <div key={`div.${item.key}`} className="situation-option-icon">
          ICON
        </div>
        {item}
      </Col>
    );
  });

  return (
    <div>
      <Button
        id={id}
        style={{ marginTop: 6, marginBottom: 12 }}
        onClick={() => setIsModalOpen(true)}
      >
        <PlusOutlined />
        新增情境項目
      </Button>
      <Modal
        title={"項目選擇"}
        className="modal-title"
        width={650}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <div className="situation-options-border">
          <Row>{functionItems}</Row>
        </div>
      </Modal>
    </div>
  );
};

export default AddSituationContentModal;
