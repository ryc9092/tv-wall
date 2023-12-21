import { useState } from "react";
import { Button, Modal, Row, Table } from "antd";
import { FAKE_TEMPLATES } from "../../../utils/Constant";
import CreateTemplate from "./createTemplate";
import ViewTemplate from "./viewTemplate";
import "../../../App.scss";

const SettingTemplateModal = ({ wall, modalOpen, setModalOpen }) => {
  const [openViewTemplateModal, setOpenViewTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const data = FAKE_TEMPLATES;

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
            onClick={viewTemplate}
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
    console.log("remove template: ", e.currentTarget.id);
  };

  const viewTemplate = (e) => {
    let templateName = e.currentTarget.id;
    FAKE_TEMPLATES.forEach((template) => {
      if (template.name === templateName) {
        setOpenViewTemplateModal(true);
        setSelectedTemplate(template);
      }
    });
  };

  return (
    <div>
      <Modal
        title={`${wall?.name} 版型管理`}
        className="modal-title"
        width={580}
        open={modalOpen}
        footer={null}
        onCancel={() => {
          setModalOpen(false);
        }}
      >
        <Row style={{ marginTop: 16, marginBottom: 12 }}>
          <CreateTemplate wall={wall} />
        </Row>
        <Table columns={columns} dataSource={data} style={{ width: "95%" }} />
      </Modal>
      <ViewTemplate
        template={selectedTemplate}
        modalOpen={openViewTemplateModal}
        setModalOpen={setOpenViewTemplateModal}
      />
    </div>
  );
};

export default SettingTemplateModal;
