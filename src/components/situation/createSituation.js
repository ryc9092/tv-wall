import { useContext, useEffect, useState } from "react";
import { Button, Form, Input, Modal, Typography } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../messages";
import "./createSituation.scss";

const CreateSituationModal = ({setReload}) => {
    const intl = useIntl();
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const onFinish = async () => {
        // todo: integrate with create situation api
        setReload(Math.random())
        setIsModalOpen(false)
    }

    return (
      <div>
        <Button onClick={() => setIsModalOpen(true)}  className="create-situation-button">
        <Typography.Text>
            <FormattedMessage {...Messages.Text_Situation_CreateSituation} />
        </Typography.Text>
      </Button>
        <Modal
          title={intl.formatMessage(Messages.Text_Situation_CreateSituation)}
          className="modal-title"
          width={700}
          open={isModalOpen}
          footer={null}
          onCancel={() => {
            setIsModalOpen(false);
          }}
        >
            <Form
                onFinish={onFinish}
            >
                <Form.Item
                    label={intl.formatMessage(Messages.Text_Situation_CreateSituation)}
                    name="situation"
                    rules={[
                        {
                        required: true,
                        message: intl.formatMessage(Messages.Text_Situation_InputSituationName)
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={intl.formatMessage(Messages.Text_Situation_SituationDescription)}
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
  