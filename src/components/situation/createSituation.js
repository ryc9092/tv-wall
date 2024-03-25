import { useContext, useState } from "react";
import { StoreContext } from "../../components/store/store";
import { Button, Form, Input, Modal, Typography } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { createSituation } from "../../api/API";
import { uuid } from "../../utils/Utils";
import Messages from "../../messages";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
} from "../../utils/Utils";
import "./createSituation.scss";

const CreateSituationModal = ({ setReload }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [store] = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onFinish = async (values) => {
    const result = await createSituation({
      id: `preset.${uuid()}`,
      description: values.description,
      store: store,
    });
    if (result) {
      setReload(Math.random());
      form.resetFields();
      setIsModalOpen(false);
      showSuccessNotificationByMsg(
        intl.formatMessage(Messages.Text_Situation_CreateSituationSuccess)
      );
    } else {
      showWarningNotification(
        intl.formatMessage(Messages.Text_Situation_CreateSituationFail)
      );
    }
  };

  return (
    <div>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="create-situation-button"
      >
        <Typography.Text>
          <FormattedMessage {...Messages.Text_Situation_CreateSituation} />
        </Typography.Text>
      </Button>
      <Modal
        title={intl.formatMessage(Messages.Text_Situation_CreateSituation)}
        className="modal-title"
        width={500}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            label={intl.formatMessage(Messages.Text_Situation_CreateSituation)}
            name="situation"
            rules={[
              {
                required: true,
                message: intl.formatMessage(
                  Messages.Text_Situation_InputSituationName
                ),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage(
              Messages.Text_Situation_SituationDescription
            )}
            name="description"
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            <FormattedMessage {...Messages.Text_Button_Save} />
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateSituationModal;
