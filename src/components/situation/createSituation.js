import { useContext, useEffect } from "react";
import { StoreContext } from "../../components/store/store";
import { Button, Form, Input, Modal } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { createSituation } from "../../api/API";
import { uuid } from "../../utils/Utils";
import Messages from "../../messages";
import { showWarningNotification } from "../../utils/Utils";
import "./createSituation.scss";
import "../../pages/Situation.scss";

const CreateSituationModal = ({
  setReload,
  isModalOpen,
  setIsModalOpen,
  setExtendSituationId = null,
  setExtendSituationDetail = null,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [store] = useContext(StoreContext);

  useEffect(() => {
    form.resetFields();
    setReload(Math.random());
  }, [form, isModalOpen, setReload]);

  const onCreateSituation = async (values) => {
    if (values.name && values.description) {
      let situationId = `preset.${uuid()}`;
      await createSituation({
        id: situationId,
        name: values.name,
        description: values.description,
        store: store,
      });
      form.resetFields();
      setReload(Math.random());
      setIsModalOpen(false);
      // for audio page to open situation detail immediately after create situation
      if (setExtendSituationDetail) {
        setExtendSituationId(situationId);
        setExtendSituationDetail(true);
      }
    } else {
      showWarningNotification(
        intl.formatMessage(Messages.Text_Common_RequiredHint)
      );
    }
  };

  return (
    <div>
      <Modal
        title=<span className="create-situation-modal-title">
          {intl.formatMessage(Messages.Text_Situation_CreateSituation)}
        </span>
        className="create-situation-modal create-situation-modal-close-icon create-situation modal-title"
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <Form
          form={form}
          onFinish={onCreateSituation}
          style={{ marginTop: "28px" }}
        >
          <Form.Item
            name="name"
            labelCol={{ span: 24 }}
            label=<span className="create-situation-subtitle">
              {intl.formatMessage(Messages.Text_Situation_SituationName)}
            </span>
          >
            <Input
              className="create-situation-input create-situation-placeholder"
              placeholder={intl.formatMessage(Messages.Text_Common_InputName)}
            />
          </Form.Item>
          <Form.Item
            name="description"
            labelCol={{ span: 24 }}
            label=<span className="create-situation-subtitle">
              {intl.formatMessage(Messages.Text_Common_Description)}
            </span>
          >
            <Input.TextArea
              className="create-situation-textarea create-situation-placeholder"
              placeholder={intl.formatMessage(
                Messages.Text_Situation_InputDescription
              )}
            />
          </Form.Item>
          {/* <Divider className="divider" />
          <div>
            <span className="create-situation-subtitle">
              <FormattedMessage {...Messages.Text_Situation_AddSituationItem} />
            </span>
            <Table
              columns={columns}
              dataSource={situationItem}
              pagination={false}
              className={
                situationItem.length === 0 ? "table table-no-item" : "table"
              }
            />
            <Dropdown
              menu={menuProps}
              trigger={["click"]}
              className="dropdown-menu"
            >
              <Button type="text" className="add-situation-item-btn">
                <img
                  alt="create"
                  src={PlusYellowIcon}
                  className="add-situation-item-btn-icon"
                />
                <span className="add-situation-item-btn-text">
                  <FormattedMessage
                    {...Messages.Text_Situation_AddSituationItem}
                  />
                </span>
              </Button>
            </Dropdown>
          </div> */}
          <div className="create-situation-btn-row">
            <Button
              className="cancel-btn"
              style={{ marginRight: 16 }}
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              <span className="cancel-btn-text">
                <FormattedMessage {...Messages.Text_Button_Cancel} />
              </span>
            </Button>
            <Button className="submit-btn" htmlType="submit">
              <span className="submit-btn-text">
                <FormattedMessage {...Messages.Text_Button_Add} />
              </span>
            </Button>
          </div>
        </Form>
        {/* <TVWallModal
          // situation={expandSituation}
          isModalOpen={isTVWallModalOpen}
          setIsModalOpen={setIsTVWallModalOpen}
        /> */}
      </Modal>
    </div>
  );
};

export default CreateSituationModal;
