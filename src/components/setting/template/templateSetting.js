import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store";
import { Button, Table } from "antd";
import CreateTemplate from "./createTemplate";
import {
  getTemplates,
  deleteTemplate,
  getTemplateScreensById,
} from "../../../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../../messages";
import TrashIcon from "../../../assets/trash.png";
import SearchIcon from "../../../assets/magnifying-glass.png";
import "./templateSetting.scss";
import "./viewTemplate.scss";
import "../../../App.scss";

import useWindowDimensions from "../../../utils/WindowDimension";

const TemplateSetting = () => {
  const intl = useIntl();
  const { width, height } = useWindowDimensions();
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
      setSelectedTemplate(tempTemplates.length > 0 ? tempTemplates[0] : null);
    })();
  }, [reload, store]);

  const columns = [
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
      sorter: (a, b) => a.col - b.col,
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
            <Button
              key={`${record.templateId}-edit`}
              id={record.templateId}
              type="text"
              style={{ marginight: 6 }}
              className="table-content"
              onClick={() => {
                setSelectedTemplate(record);
              }}
            >
              <img alt="edit" src={SearchIcon} className="table-content-icon" />
            </Button>
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

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateSize, setTemplateSize] = useState({ col: 1, row: 1 });
  const [screenList, setScreenList] = useState([]);
  const [handledScreenList, setHandledScreenList] = useState([]);
  const [screenBlockMap, setScreenBlockMap] = useState({});
  const [templateObj, setTemplateObj] = useState(null);

  useEffect(() => {
    if (selectedTemplate) {
      (async () => {
        const screens = await getTemplateScreensById(
          store,
          selectedTemplate.templateId
        );
        setScreenList(screens);
      })();
    }
  }, [selectedTemplate]);

  useEffect(() => {
    if (selectedTemplate) {
      (async () => {
        const screens = await getTemplateScreensById(
          store,
          selectedTemplate.templateId
        );
        setScreenList(screens);
        setTemplateSize({
          col: selectedTemplate.col,
          row: selectedTemplate.row,
        });

        let tempHandledScreenList = [];
        let tempScreenBlockMap = {};
        screens?.forEach((screen) => {
          tempHandledScreenList.push(screen.num);
          tempScreenBlockMap = {
            ...tempScreenBlockMap,
            [screen.num]: screen.block,
          };
        });
        setHandledScreenList(tempHandledScreenList);
        setScreenBlockMap(tempScreenBlockMap);
      })();
    }
  }, [selectedTemplate]);

  useEffect(() => {
    // create template table
    let tempRow = [];
    let tempTemplate = [];
    screenList.forEach((screen) => {
      tempRow.push(
        <td
          className={
            handledScreenList?.includes(screen.num)
              ? "view-screen-block-handled"
              : "view-screen-block-default"
          }
          key={screen.num}
        >
          <span
            className={
              handledScreenList?.includes(screen.num)
                ? "view-screen-block-text-handled"
                : "view-screen-block-text-default"
            }
          >
            {screen.num}
          </span>

          {screen.num in screenBlockMap ? (
            <span className="view-screen-block-num view-screen-block-num-text">
              {screenBlockMap[screen.num]}
            </span>
          ) : null}
        </td>
      );
      if (tempRow.length === templateSize.col) {
        tempTemplate.push(<tr key={screen.num}>{tempRow}</tr>);
        tempRow = []; // clear row
      }
    });
    setTemplateObj(tempTemplate);
  }, [screenList, selectedTemplate]);

  const removeTemplate = (template) => {
    (async () => {
      const result = await deleteTemplate(store, template.templateId);
      if (result) {
        setReload(Math.random());
      }
    })();
  };

  return (
    <div
      className={
        store.siderCollapse
          ? "template-setting-content-container-collapse"
          : "template-setting-content-container"
      }
    >
      <div className="template-setting-title-row">
        <div className="page-title">
          <FormattedMessage
            {...Messages.Text_TemplateSetting_TemplateSetting}
          />
        </div>
        <CreateTemplate setReload={setReload} />
      </div>
      <div className="template-setting-table-row">
        <div
          className={
            store.siderCollapse
              ? "template-setting-table-container-collapse"
              : "template-setting-table-container"
          }
        >
          <Table
            columns={columns}
            dataSource={templates}
            // size="small"
            scroll={{ x: "max-content", y: height - 365 }}
          />
        </div>
        <div
          className={
            store.siderCollapse
              ? "template-setting-screen-container-collapse"
              : "template-setting-screen-container"
          }
        >
          <div
            style={{
              backgroundColor: "#FAFAFA",
              height: 56,
              borderRadius: 8,
              textAlign: "center",
              paddingTop: 20,
              color: "#A5A5A5",
            }}
          >
            <FormattedMessage {...Messages.Text_WallSetting_Preview} />
          </div>
          <div className="template-setting-screen-block-container">
            {templateObj}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSetting;
