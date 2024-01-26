import { useEffect, useState } from "react";
import { Button, Modal, Row, Select, Table, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import CreateWall from "./createWall";
import ViewWall from "./viewWall";
import { getWalls, deleteWall } from "../../../api/API";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
} from "../../../utils/Utils";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../../messages";
import "../../../App.scss";

const SettingWallModal = () => {
  const intl = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWall, setSelectedWall] = useState(null);
  const [openViewWallModal, setOpenViewWallModal] = useState(false);
  const [walls, setWalls] = useState([]);
  const [reload, setReload] = useState(null);

  useEffect(() => {
    (async () => {
      let tempWalls = [];
      const result = await getWalls();
      result.forEach((wall) => {
        wall.key = wall.wallId;
        tempWalls.push(wall);
      });
      setWalls(tempWalls);
    })();
  }, [reload]);

  const zones = [
    {
      value: "zone1",
      label: "區域1",
    },
  ];

  const columns = [
    {
      title: "ID",
      dataIndex: "wallId",
      key: "wallId",
      render: (text) => <span>{text}</span>,
    },
    {
      title: intl.formatMessage(Messages.Text_Common_Name),
      dataIndex: "wallName",
      key: "wallName",
    },
    {
      title: intl.formatMessage(Messages.Text_Common_Dimension),
      dataIndex: ["col", "row"],
      key: "dimension",
      render: (text, record) => <span>{`${record.col} X ${record.row}`}</span>,
    },
    {
      title: intl.formatMessage(Messages.Text_Button_Operation),
      dataIndex: "wallId",
      key: "action",
      render: (text) => (
        <div key={`${text}-action`}>
          <Button
            key={`${text}-edit`}
            id={text}
            onClick={viewWall}
            style={{ marginRight: 6 }}
          >
            <FormattedMessage {...Messages.Text_Button_View} />
          </Button>
          <Button key={`${text}-delete`} id={text} onClick={removeWall}>
            <FormattedMessage {...Messages.Text_Button_Delete} />
          </Button>
        </div>
      ),
    },
  ];

  const removeWall = (e) => {
    console.log("remove wall: ", e.currentTarget.id);
    (async () => {
      const result = await deleteWall();
      if (result) {
        showSuccessNotificationByMsg(
          intl.formatMessage(Messages.Text_WallSetting_DeleteSuccess)
        );
        setReload(Math.random);
      } else
        showWarningNotification(
          intl.formatMessage(Messages.Text_WallSetting_DeleteFail)
        );
    })();
  };

  const viewWall = (e) => {
    let wallId = e.currentTarget.id;
    walls.forEach((wall) => {
      if (wall.wallId === wallId) {
        setOpenViewWallModal(true);
        setSelectedWall(wall);
      }
    });
  };

  return (
    <div>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="setting-option-button"
      >
        <Typography.Text className="setting-option-text">
          <FormattedMessage {...Messages.Text_WallSetting_WallSetting} />
        </Typography.Text>
        <></>
        <EditOutlined className="setting-option-icon" />
      </Button>
      <Modal
        title={intl.formatMessage(Messages.Text_WallSetting_WallSetting)}
        className="modal-title"
        width={658}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <Row style={{ marginTop: 16, marginBottom: 12 }}>
          {/* <Select
            options={zones}
            defaultValue={"zone1"}
            style={{ width: "120px", marginRight: 8 }}
          /> */}
          <CreateWall setReload={setReload} />
        </Row>
        <Table columns={columns} dataSource={walls} style={{ width: "95%" }} />
        <ViewWall
          wall={selectedWall}
          modalOpen={openViewWallModal}
          setModalOpen={setOpenViewWallModal}
        />
      </Modal>
    </div>
  );
};

export default SettingWallModal;
