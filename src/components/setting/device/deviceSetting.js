import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store";
import { Button, Input, Table, Typography } from "antd";
import { getDevices, editDevice } from "../../../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../../messages";
import PencilIcon from "../../../assets/pencil.png";
import "./deviceSetting.scss";

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

const TemplateSetting = () => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [devices, setDevices] = useState([]);
  const [isEdited, setIsEdited] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [editedNickName, setEditedNickName] = useState("");
  const [editedAudioAnalog, setEditedAudioAnalog] = useState("");
  const [editedAudioHdmi, setEditedAudioHdmi] = useState("");
  const [editedIP, setEditedIP] = useState("");
  const [reload, setReload] = useState(null);

  useEffect(() => {
    (async () => {
      let tempDevices = [];
      const devices = await getDevices(store);
      devices.forEach((device) => {
        device.key = device.name;
        tempDevices.push(device);
      });
      setDevices(tempDevices);
    })();
  }, [reload]);

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

  const columns = [
    {
      title: intl.formatMessage(Messages.Text_Common_Type),
      dataIndex: ["type", "isNew"],
      key: "type",
      filters: [
        {
          text: intl.formatMessage(Messages.Text_Common_Encoder),
          value: "encoder",
        },
        {
          text: intl.formatMessage(Messages.Text_Common_Decoder),
          value: "decoder",
        },
      ],
      onFilter: (value, data) => data.type.indexOf(value) === 0,
      render: (text, record) => (
        <div
          className={
            record.isNew === false
              ? "table-content table-content-text-isnew"
              : "table-content"
          }
        >
          {record.type}
        </div>
      ),
    },
    {
      title: intl.formatMessage(Messages.Text_Common_Name),
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="table-content">{text}</span>,
    },
    {
      title: intl.formatMessage(Messages.Text_Common_Alias),
      dataIndex: "nickName",
      key: "nickName",
      editable: true,
      render: (text) => <span className="table-content">{text}</span>,
    },
    {
      title: "analog",
      dataIndex: "audioAnalogy",
      key: "audioAnalogy",
      editable: true,
      render: (text) => <span className="table-content">{text}</span>,
    },
    {
      title: "hdmi",
      dataIndex: "audioHdmi",
      key: "audioHdmi",
      editable: true,
      render: (text) => <span className="table-content">{text}</span>,
    },
    // {
    //   title: "ip",
    //   dataIndex: "additionalDeviceIp",
    //   key: "additionalDeviceIp",
    //   editable: true,
    //   render: (text) => <span>{text}</span>,
    // },
    {
      title: intl.formatMessage(Messages.Text_DeviceSetting_Operate),
      width: 160,
      key: "edit",
      dataIndex: "id",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <div style={{ display: "flex" }}>
            <div
              className="device-setting-save-btn"
              onClick={() => save(record.key)}
            >
              <span className="device-setting-save-btn-text">
                <FormattedMessage {...Messages.Text_Button_Save} />
              </span>
            </div>
            <div className="device-setting-cancel-btn" onClick={cancel}>
              <span className="device-setting-cancel-btn-text">
                <FormattedMessage {...Messages.Text_Button_Cancel} />
              </span>
            </div>
          </div>
        ) : (
          <div>
            <Button
              key={`edit.${record}`}
              style={{ border: "none" }}
              onClick={() => edit(record)}
            >
              <img
                alt="edit"
                src={PencilIcon}
                className="device-table-content-icon"
              />
              {/* <FormattedMessage {...Messages.Text_Button_Edit} /> */}
            </Button>
            {/* <Button key={`reboot.${record}`} onClick={() => reboot(record)}>
              <FormattedMessage {...Messages.Text_DeviceSetting_Reboot} />
            </Button> */}
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
    <div className="content-container">
      <div className="title-row">
        <div className="page-title">
          <FormattedMessage {...Messages.Text_DeviceSetting_AdvanceSetting} />
        </div>
      </div>
      <div className="table-container ">
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          columns={mergedColumns}
          dataSource={devices}
          pagination={{ pageSize: 9 }}
          style={{ marginTop: 20 }}
        />
      </div>
    </div>
  );
};

export default TemplateSetting;