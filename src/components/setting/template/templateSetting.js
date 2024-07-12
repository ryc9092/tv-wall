import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store";
import { Button, Table } from "antd";
import CreateTemplate from "./createTemplate";
import ViewTemplate from "./viewTemplate";
import { getTemplates, deleteTemplate } from "../../../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../../messages";
import TrashIcon from "../../../assets/trash.png";
import "./templateSetting.scss";
import "../../../App.scss";

const TemplateSetting = () => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [templates, setTemplates] = useState([]);
  const [reload, setReload] = useState(null);

  useEffect(() => {
    (async () => {
      let tempTemplates = [];
      const result = await getTemplates(store);
      if (result) {
        result?.forEach((template) => {
          template.key = template.templateId;
          tempTemplates.push(template);
        });
      }
      setTemplates(tempTemplates);
    })();
  }, [reload]);

  const columns = [
    {
      title: <span className="table-head">ID</span>,
      dataIndex: "templateId",
      key: "templateId",
      render: (text) => <span className="table-content">{text}</span>,
    },
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_Common_Name)}
        </span>
      ),
      dataIndex: "templateName",
      key: "templateName",
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
      dataIndex: ["col", "row", "isDefault"],
      key: "dimension",
      render: (text, record) => (
        <div>
          <span className="table-content">{`${record.col} X ${record.row}`}</span>
          {record.isDefault === 1 ? (
            <span className="table-default-desc">
              {`  (${intl.formatMessage(Messages.Text_Common_Default)})`}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_Button_Operation)}
        </span>
      ),
      dataIndex: "templateId",
      key: "action",
      render: (text, record) => {
        return (
          <div key={`${text}-action`}>
            <ViewTemplate template={record} />
            <Button
              key={`${text}-delete`}
              id={text}
              type="text"
              onClick={() => {
                removeTemplate(record);
              }}
              className="table-content"
            >
              <img
                alt="remove"
                src={TrashIcon}
                className="table-content-icon"
              />
            </Button>
          </div>
        );
      },
    },
  ];

  const removeTemplate = (template) => {
    (async () => {
      const result = await deleteTemplate(store, template.templateId);
      if (result) {
        setReload(Math.random());
      }
    })();
  };

  return (
    <div className="content-container">
      <div className="title-row">
        <div className="page-title">
          <FormattedMessage
            {...Messages.Text_TemplateSetting_TemplateSetting}
          />
        </div>
        <CreateTemplate setReload={setReload} />
      </div>
      <div className="table-container ">
        <Table columns={columns} dataSource={templates} />
      </div>
    </div>
  );
};

export default TemplateSetting;
