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

const EditableCell = ({ editing, dataIndex, setCol, children }) => {
  return (
    <td>
      {editing ? (
        <div
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          <Input onChange={(e) => setCol(e.target.value)} />
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
    setEditingKey("");
    setEditedNickName("");
    setEditedAudioAnalog("");
    setEditedAudioHdmi("");
    setEditedIP("");
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
      title: "類型",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "編碼器", value: "encoder" },
        { text: "解碼器", value: "decoder" },
      ],
      onFilter: (value, data) => data.type.indexOf(value) === 0,
    },
    {
      title: "名稱",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "別名",
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
    {
      title: "ip",
      dataIndex: "additionalDeviceIp",
      key: "additionalDeviceIp",
      editable: true,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "狀態",
      key: "state",
      dataIndex: "state",
      sorter: (a, b) => a.state.length - b.state.length,
      render: (_, { state }) => (
        <>
          {state === "Up" ? (
            <Tag color={"green"} key={state}>
              {state}
            </Tag>
          ) : state === "Down" ? (
            <Tag color={"yellow"} key={state}>
              {state}
            </Tag>
          ) : (
            <Tag color={"red"} key={state}>
              {state}
            </Tag>
          )}
        </>
      ),
    },
    {
      title: "編輯",
      key: "edit",
      dataIndex: "id",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Typography.Link onClick={cancel}>Cancel</Typography.Link>
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
    if (!col.editable) {
      return col;
    } else if (col.key === "nickName") {
      return {
        ...col,
        onCell: (record) => ({
          record,
          title: col.title,
          editing: isEditing(record),
          setCol: setEditedNickName,
        }),
      };
    } else if (col.key === "audioAnalogy") {
      return {
        ...col,
        onCell: (record) => ({
          record,
          title: col.title,
          editing: isEditing(record),
          setCol: setEditedAudioAnalog,
        }),
      };
    } else if (col.key === "audioHdmi") {
      return {
        ...col,
        onCell: (record) => ({
          record,
          title: col.title,
          editing: isEditing(record),
          setCol: setEditedAudioHdmi,
        }),
      };
    } else {
      return {
        ...col,
        onCell: (record) => ({
          record,
          title: col.title,
          editing: isEditing(record),
          setCol: setEditedIP,
        }),
      };
    }
  });

  return (
    <div>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="setting-option-button"
      >
        <Typography.Text className="setting-option-text">
          設備進階設定
        </Typography.Text>
        <></>
        <EditOutlined className="setting-option-icon" />
      </Button>
      <Modal
        title={`設備進階設定`}
        className="modal-title"
        width={950}
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
