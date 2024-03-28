import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../../components/store/store";
import { Button, Checkbox, Modal, Row, Table, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import CreateTemplate from "./createTemplate";
import ViewTemplate from "./viewTemplate";
import {
  getTemplates,
  deleteTemplate,
  setDefaultTemplate,
} from "../../../api/API";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
} from "../../../utils/Utils";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../../messages";
import "../../../App.scss";

const SettingTemplateModal = () => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openViewTemplateModal, setOpenViewTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [reload, setReload] = useState(null);

  useEffect(() => {
    (async () => {
      let tempTemplates = [];
      const result = await getTemplates(store);
      result.forEach((template) => {
        template.key = template.templateId;
        tempTemplates.push(template);
      });
      setTemplates(tempTemplates);
    })();
  }, [reload]);

  const changeDefaultTemplate = async (record) => {
    const result = await setDefaultTemplate(
      store,
      record.templateId,
      record.col,
      record.row
    );
    if (result) {
      let tempTemplates = templates.slice();
      templates.forEach((template, idx) => {
        if (template.templateId === record.templateId)
          tempTemplates[idx].isDefault = true;
        else if (template.col === record.col && template.row === record.row)
          tempTemplates[idx].isDefault = false;
      });
      setTemplates(tempTemplates);
    }
  };

  const columns = [
    {
      title: intl.formatMessage(Messages.Text_TemplateSetting_Default),
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
      title: intl.formatMessage(Messages.Text_Common_Name),
      dataIndex: "templateName",
      key: "templateName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: intl.formatMessage(Messages.Text_Common_Dimension),
      dataIndex: ["col", "row"],
      key: "dimension",
      render: (text, record) => <span>{`${record.col} X ${record.row}`}</span>,
    },
    {
      title: intl.formatMessage(Messages.Text_Button_Operation),
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
            <FormattedMessage {...Messages.Text_Button_View} />
          </Button>
          <Button key={`${text}-delete`} id={text} onClick={removeTemplate}>
            <FormattedMessage {...Messages.Text_Button_Delete} />
          </Button>
        </div>
      ),
    },
  ];

  const removeTemplate = (e) => {
    const templateId = e.currentTarget.id;
    (async () => {
      const result = await deleteTemplate(store, templateId);
      if (result) {
        showSuccessNotificationByMsg(
          intl.formatMessage(Messages.Text_TemplateSetting_DeleteSuccess)
        );
        setReload(Math.random);
      } else
        showWarningNotification(
          intl.formatMessage(Messages.Text_TemplateSetting_DeleteFail)
        );
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
          <FormattedMessage
            {...Messages.Text_TemplateSetting_TemplateSetting}
          />
        </Typography.Text>
        <></>
        <EditOutlined className="setting-option-icon" />
      </Button>
      <Modal
        title={intl.formatMessage(
          Messages.Text_TemplateSetting_TemplateManagement
        )}
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
