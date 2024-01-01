import { useEffect, useState } from "react";
import { Button, Checkbox, Modal, Row, Table, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import CreateTemplate from "./createTemplate";
import ViewTemplate from "./viewTemplate";
import { getTemplates, deleteTemplate } from "../../../api/API";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
} from "../../../utils/Utils";
import "../../../App.scss";

const SettingTemplateModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openViewTemplateModal, setOpenViewTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [reload, setReload] = useState(null);

  useEffect(() => {
    (async () => {
      let tempTemplates = [];
      const result = await getTemplates();
      result.forEach((template) => {
        template.key = template.templateId;
        tempTemplates.push(template);
      });
      setTemplates(tempTemplates);
    })();
  }, [reload]);

  const changeDefaultTemplate = (record) => {
    let tempTemplates = templates.slice();
    templates.forEach((template, idx) => {
      if (template.templateId === record.templateId) tempTemplates[idx].isDefault = true;
      else if (
        template.col === record.col &&
        template.row === record.row
      )
        tempTemplates[idx].isDefault = false;
    });
    setTemplates(tempTemplates);
  };

  const columns = [
    {
      title: "預設",
      dataIndex: ["isDefault", "templateId", "col", "row"],
      key: "default",
      render: (text, record) => (
        <Checkbox
          key={record.templateId}
          checked={record.isDefault}
          onChange={() => {
            changeDefaultTemplate(record);
          }}
        ></Checkbox>
      ),
    },
    {
      title: "ID",
      dataIndex: "templateId",
      key: "templateId",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "名稱",
      dataIndex: "templateName",
      key: "templateName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "維度",
      dataIndex: ["col", "row"],
      key: "dimension",
      render: (text, record) => (
        <span>{`${record.col} X ${record.row}`}</span>
      ),
    },
    {
      title: "操作",
      dataIndex: "templateId",
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
          <Button key={`${text}-delete`} id={text} onClick={removeTemplate}>
            刪除
          </Button>
        </div>
      ),
    },
  ];

  const removeTemplate = (e) => {
    const templateName = e.currentTarget.id;
    console.log(`remove template: ${templateName}`);
    (async () => {
      const result = await deleteTemplate();
      if (result) {
        showSuccessNotificationByMsg("版型移除成功");
        setReload(Math.random);
      } else showWarningNotification("版型移除失敗");
    })();
  };

  const viewTemplate = (e) => {
    let templateId = e.currentTarget.id;
    templates.forEach((template) => {
      if (template.templateId === templateId) {
        setOpenViewTemplateModal(true);
        setSelectedTemplate(template);
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
          電視牆版型設定
        </Typography.Text>
        <></>
        <EditOutlined className="setting-option-icon" />
      </Button>
      <Modal
        title={`版型管理`}
        className="modal-title"
        width={680}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <Row style={{ marginTop: 16, marginBottom: 12 }}>
          <CreateTemplate setReload={setReload} />
        </Row>
        <Table
          columns={columns}
          dataSource={templates}
          style={{ width: "95%" }}
        />
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
