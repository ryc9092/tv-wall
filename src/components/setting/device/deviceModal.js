import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../../components/store/store";
import { Button, Input, Modal, Table, Tag, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { editDevice, getEncoders, getDecoders } from "../../../api/API";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
} from "../../../utils/Utils";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../../messages";
import "../../../App.scss";
import "./deviceModal.scss";

const EditableCell = ({
  editing,
  dataIndex,
  setCol,
  children,
  record,
  dataIndexValueMap,
  isEdited,
  setIsEdited,
  setEditedNickName,
  setEditedAudioAnalog,
  setEditedAudioHdmi,
}) => {
  if (record && editing === true && isEdited === false) {
    setIsEdited(true);
    setEditedNickName(record.nickName);
    setEditedAudioAnalog(record.audioAnalogy);
    setEditedAudioHdmi(record.audioHdmi);
  }
  return (
    <td>
      {editing ? (
        <div
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          <Input
            value={dataIndexValueMap[dataIndex]}
            onChange={(e) => {
              setCol(e.target.value);
            }}
          />
        </div>
      ) : (
        children
      )}
    </td>
  );
};

const SettingDeviceModal = () => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [devices, setDevices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [editedNickName, setEditedNickName] = useState("");
  const [editedAudioAnalog, setEditedAudioAnalog] = useState("");
  const [editedAudioHdmi, setEditedAudioHdmi] = useState("");
  const [editedIP, setEditedIP] = useState("");
  const [reload, setReload] = useState(null);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    const index = devices.findIndex((item) => key === item.key);
    const { ...device } = { ...devices[index] };
    const result = await editDevice(
      store,
      device.mac,
      editedNickName,
      editedAudioAnalog,
      editedAudioHdmi,
      editedIP,
      device.model,
      device.type
    );
    if (result) {
      // showSuccessNotificationByMsg(
      //   intl.formatMessage(Messages.Text_WallSetting_DeleteSuccess)
      // );
      setReload(Math.random);
    } else {
      // showWarningNotification(
      //   intl.formatMessage(Messages.Text_WallSetting_DeleteFail)
      // );
    }
    setIsEdited(false);
    setEditingKey("");
    setEditedNickName("");
    setEditedAudioAnalog("");
    setEditedAudioHdmi("");
    // setEditedIP("");
  };

  useEffect(() => {
    (async () => {
      let tempDevices = [];

      const encoders = await getEncoders(store);
      encoders.forEach((encoder) => {
        encoder.key = encoder.name;
        tempDevices.push(encoder);
      });

      const decoders = await getDecoders(store);
      decoders.forEach((decoder) => {
        decoder.key = decoder.name;
        tempDevices.push(decoder);
      });
      setDevices(tempDevices);
    })();
  }, [reload]);

  const columns = [
    {
      title: intl.formatMessage(Messages.Text_DeviceSetting_Type),
      dataIndex: "type",
      key: "type",
      filters: [
        {
          text: intl.formatMessage(Messages.Text_DeviceStatus_Encoder),
          value: "encoder",
        },
        {
          text: intl.formatMessage(Messages.Text_DeviceStatus_Decoder),
          value: "decoder",
        },
      ],
      onFilter: (value, data) => data.type.indexOf(value) === 0,
    },
    {
      title: intl.formatMessage(Messages.Text_Common_Name),
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: intl.formatMessage(Messages.Text_DeviceSetting_Alias),
      dataIndex: "nickName",
      key: "nickName",
      editable: true,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "analog",
      dataIndex: "audioAnalogy",
      key: "audioAnalogy",
      editable: true,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "hdmi",
      dataIndex: "audioHdmi",
      key: "audioHdmi",
      editable: true,
      render: (text) => <span>{text}</span>,
    },
    // {
    //   title: "ip",
    //   dataIndex: "additionalDeviceIp",
    //   key: "additionalDeviceIp",
    //   editable: true,
    //   render: (text) => <span>{text}</span>,
    // },
    {
      title: intl.formatMessage(Messages.Text_DeviceSetting_Edit),
      key: "edit",
      dataIndex: "id",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 12,
              }}
            >
              <FormattedMessage {...Messages.Text_Button_Save} />
            </Typography.Link>
            <Typography.Link onClick={cancel}>
              <FormattedMessage {...Messages.Text_Button_Cancel} />
            </Typography.Link>
          </span>
        ) : (
          <div key={record} id={record} onClick={() => edit(record)}>
            <EditOutlined className="device-edit" />
          </div>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    const dataIndexValueMap = {
      nickName: editedNickName,
      audioAnalogy: editedAudioAnalog,
      audioHdmi: editedAudioHdmi,
    };
    if (!col.editable) {
      return col;
    } else if (col.key === "nickName") {
      return {
        ...col,
        onCell: (record) => ({
          record,
          dataIndex: col.dataIndex,
          editing: isEditing(record),
          setCol: setEditedNickName,
          dataIndexValueMap,
          isEdited,
          setIsEdited,
          setEditedNickName,
          setEditedAudioAnalog,
          setEditedAudioHdmi,
        }),
      };
    } else if (col.key === "audioAnalogy") {
      return {
        ...col,
        onCell: (record) => ({
          record,
          dataIndex: col.dataIndex,
          editing: isEditing(record),
          setCol: setEditedAudioAnalog,
          dataIndexValueMap,
          isEdited,
          setIsEdited,
          setEditedNickName,
          setEditedAudioAnalog,
          setEditedAudioHdmi,
        }),
      };
    } else {
      // if (col.key === "audioHdmi") {
      return {
        ...col,
        onCell: (record) => ({
          record,
          dataIndex: col.dataIndex,
          editing: isEditing(record),
          setCol: setEditedAudioHdmi,
          dataIndexValueMap,
          isEdited,
          setIsEdited,
          setEditedNickName,
          setEditedAudioAnalog,
          setEditedAudioHdmi,
        }),
      };
    }
    // else {
    //   return {
    //     ...col,
    //     onCell: (record) => ({
    //       record,
    //       dataIndex: col.dataIndex,
    //       editing: isEditing(record),
    //       setCol: setEditedIP,
    //     }),
    //   };
    // }
  });

  return (
    <div>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="setting-option-button"
      >
        <Typography.Text className="setting-option-text">
          <FormattedMessage {...Messages.Text_DeviceSetting_AdvanceSetting} />
        </Typography.Text>
        <></>
        <EditOutlined className="setting-option-icon" />
      </Button>
      <Modal
        title={intl.formatMessage(Messages.Text_DeviceSetting_AdvanceSetting)}
        className="modal-title"
        style={{ marginTop: -80 }}
        width={1160}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          columns={mergedColumns}
          dataSource={devices}
          style={{ width: "95%", marginTop: 20 }}
        />
      </Modal>
    </div>
  );
};

export default SettingDeviceModal;
