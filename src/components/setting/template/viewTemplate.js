import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../../components/store/store";
import { Button, Modal } from "antd";
import { getTemplateScreensById } from "../../../api/API";
import { useIntl } from "react-intl";
import Messages from "../../../messages";
import ViewIcon from "../../../assets/magnifying-glass.png";
import "../../../App.scss";
import "./viewTemplate.scss";

const ViewTemplate = ({ template }) => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [templateSize, setTemplateSize] = useState({ col: 1, row: 1 });
  const [screenList, setScreenList] = useState([]);
  const [handledScreenList, setHandledScreenList] = useState([]);
  const [screenBlockMap, setScreenBlockMap] = useState({});
  const [templateObj, setTemplateObj] = useState(null);

  const blockMap = { 1: "A", 2: "B", 3: "C", 4: "D", 5: "E", 6: "F", 7: "G" };

  useEffect(() => {
    if (template && modalOpen) {
      (async () => {
        const screens = await getTemplateScreensById(
          store,
          template.templateId
        );
        setScreenList(screens);
        setTemplateSize({ col: template.col, row: template.row });

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
  }, [template, modalOpen]);

  useEffect(() => {
    setModalOpen(modalOpen);
  }, [modalOpen, setModalOpen]);

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
              {blockMap[screenBlockMap[screen.num]]}
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
  }, [screenList]);

  return (
    <span>
      <Button
        key={`${template.templateId}-edit`}
        id={template.wallId}
        type="text"
        onClick={() => setModalOpen(true)}
        style={{ marginight: 6 }}
        className="table-content"
      >
        <img alt="edit" src={ViewIcon} className="table-content-icon" />
      </Button>
      <Modal
        title={intl.formatMessage(Messages.Text_TemplateSetting_ViewTemplate)}
        className="view-template-modal view-template-modal-close-icon view-template-setting modal-title"
        open={modalOpen}
        footer={null}
        onCancel={() => {
          setModalOpen(false);
        }}
      >
        <div className="template-info" style={{ marginTop: "28px" }}>
          <span>{"ID: "}</span>
          <span>{template.templateId}</span>
        </div>
        <div className="template-info" style={{ marginTop: "8px" }}>
          <span>
            {intl.formatMessage(Messages.Text_Common_Name)}
            {": "}
          </span>
          <span>{template.templateName}</span>
        </div>
        <div className="template-info" style={{ marginTop: "8px" }}>
          <span>
            {intl.formatMessage(Messages.Text_Common_Dimension)}
            {": "}
          </span>
          <span>
            {template.col}
            {" X "}
            {template.row}
          </span>
        </div>
        <div style={{ marginTop: "40px" }}>{templateObj}</div>
      </Modal>
    </span>
  );
};

export default ViewTemplate;
