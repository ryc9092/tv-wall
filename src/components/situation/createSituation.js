import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../components/store/store";
import { Button, Divider, Dropdown, Form, Input, Modal, Table } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { createSituation } from "../../api/API";
import TVWallModal from "./tvWallModal";
import { uuid } from "../../utils/Utils";
import Messages from "../../messages";
import PlusIcon from "../../assets/plus-white.png";
import TrashIcon from "../../assets/trash.png";
import PlusYellowIcon from "../../assets/plus-yellow.png";
import TVWallIcon from "../../assets/tvWall.png";
import SingleScreenIcon from "../../assets/screen.png";
import USBIcon from "../../assets/usb.png";
import AudioIcon from "../../assets/audio.png";
import "./createSituation.scss";
import "../../pages/Situation.scss";

const CreateSituationModal = ({ setReload }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [store] = useContext(StoreContext);
  const [isSituationCreated, setIsSituationCreated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isTVWallModalOpen, setIsTVWallModalOpen] = useState(false);

  useEffect(() => {
    form.resetFields();
    setIsSituationCreated(false);
    setReload(Math.random());
  }, [isModalOpen]);

  const onCreateSituation = async (values) => {
    if (values.name && values.description) {
      await createSituation({
        id: `preset.${uuid()}`,
        name: values.name,
        description: values.description,
        store: store,
      });
      setIsSituationCreated(true);
      form.resetFields();
      setReload(Math.random());
      setIsModalOpen(false);
    }
  };

  const situationItem = [
    // { id: "test", remark: "testefsdlfkjsdflkj", set_type: "sdlkfjsdlfkj" },
  ];

  const columns = [
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_Common_Type)}
        </span>
      ),
      dataIndex: "set_type",
      key: "type",
      render: (text) => <span className="table-content">{text}</span>,
    },
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_Common_Name)}
        </span>
      ),
      dataIndex: "id",
      key: "name",
      render: (text) => {
        return <span className="table-content">{text}</span>;
      },
    },
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_Common_Description)}
        </span>
      ),
      dataIndex: "remark",
      key: "description",
      render: (text) => {
        return <span className="table-content">{text}</span>;
      },
    },
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_Button_Operation)}
        </span>
      ),
      dataIndex: "id",
      key: "operate",
      render: (text, record) => {
        return (
          <div key={`${text}-action`}>
            <Button
              key={`${text}-delete`}
              id={text}
              type="text"
              onClick={() => {}}
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

  const handleMenuClick = (event) => {
    // onCreateSituation()
    console.log(form.getFieldsValue(), "!!!", event.key);
    if (event.key === "tvwall") setIsTVWallModalOpen(true);
  };

  const items = [
    {
      label: (
        <span className="dropdown-menu-text">
          {intl.formatMessage(Messages.Text_Situation_TVWallConnection)}
        </span>
      ),
      key: "tvwall",
      icon: (
        <img src={TVWallIcon} alt="tvwall" className="dropdown-menu-icon" />
      ),
    },
    {
      label: (
        <span className="dropdown-menu-text">
          {intl.formatMessage(Messages.Text_Situation_SingleScreenConnection)}
        </span>
      ),
      key: "singlescreen",
      icon: (
        <img
          src={SingleScreenIcon}
          alt="singlescreen"
          className="dropdown-menu-icon"
        />
      ),
    },
    {
      label: (
        <span className="dropdown-menu-text">
          {intl.formatMessage(Messages.Text_Situation_USBConnection)}
        </span>
      ),
      key: "usb",
      icon: <img src={USBIcon} alt="usb" className="dropdown-menu-icon" />,
    },
    {
      label: (
        <span className="dropdown-menu-text">
          {intl.formatMessage(Messages.Text_Situation_AudioConnection)}
        </span>
      ),
      key: "audio",
      icon: <img src={AudioIcon} alt="audio" className="dropdown-menu-icon" />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <div>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="create-situation-btn"
      >
        <img
          alt="create"
          src={PlusIcon}
          className="create-situation-btn-icon"
        />
        <span className="create-situation-btn-text">
          <FormattedMessage {...Messages.Text_Situation_CreateSituation} />
        </span>
      </Button>
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
