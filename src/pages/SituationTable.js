import React, { useContext, useEffect, useState } from "react";
import { Button, Dropdown, Table, Modal } from "antd";
import { StoreContext } from "../components/store/store";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import CreateSituation from "../components/situation/createSituation";
import {
  getEncoders,
  getDecoders,
  getSituations,
  getSituationDetails,
  removeSituation,
  activateSituation,
  removeSituationDetail,
} from "../api/API";
import TVWallModal from "../components/situation/tvWallModal";
import SingleScreenModal from "../components/situation/singlescreenModal";
import USBModal from "../components/situation/usbModal";
import AudioModal from "../components/situation/audioModal";
import PlayIcon from "../assets/play-black.png";
import PauseIcon from "../assets/pause.png";
import TrashIcon from "../assets/trash.png";
import PlusIcon from "../assets/plus-white.png";
import PlusYellowIcon from "../assets/plus-yellow.png";
import TVWallIcon from "../assets/tvWall.png";
import SingleScreenIcon from "../assets/screen.png";
import USBIcon from "../assets/usb.png";
import AudioIcon from "../assets/audio.png";
import PencilIcon from "../assets/pencil.png";
import "../App.scss";
import "./SituationTable.scss";
import "./Situation.scss";
import "./Audio.scss";

let situationActivatedList = []; // for set activate situation list immediately

const Situation = () => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [reload, setReload] = useState(null);
  const [isSituationModalOpen, setIsSituationModalOpen] = useState(false);

  // get situations on reload
  const [situations, setSituations] = useState([]);
  const [situationItemLength, setSituationItemLength] = useState(0);
  useEffect(() => {
    (async () => {
      const situations = await getSituations(store);
      setSituations(situations);
    })();
  }, [reload, store]);

  // play situation
  const [situationActivated, setSituationActivated] = useState([]);
  const startSituation = async (situationId) => {
    activateSituation(situationId, store).then(() => {
      let idx = situationActivatedList.indexOf(situationId);
      situationActivatedList.splice(idx, 1);
      setSituationActivated(situationActivatedList);
      setReload(Math.random());
    });
    situationActivatedList.push(situationId);
    setSituationActivated([situationId, ...situationActivated]);
    setReload(Math.random());
  };

  // edit situation
  const [editSituation, setEditSituation] = useState(null);
  const [editSituationDetails, setEditSituationDetails] = useState([]);
  const [openSituationDetailModal, setOpenSituationDetailModal] =
    useState(false);
  const onClickEditBtn = async (event) => {
    const situationId = event.currentTarget.id;
    let tempSituation;
    situations.forEach((situation) => {
      if (situation.id === situationId) tempSituation = situation;
    });
    let detail = await getSituationDetails(store, situationId);
    setEditSituationDetails(detail);
    setEditSituation(tempSituation);
    setOpenSituationDetailModal(true);
  };

  const deleteSituation = async (event) => {
    const situationId = event.currentTarget.id;
    console.log(situationId);
    await removeSituation(situationId, store);
    setReload(Math.random());
  };

  const deleteSituationDetail = async (situationDetailId) => {
    await removeSituationDetail(situationDetailId, store);
    setReload(Math.random());
  };

  const columns = [
    {
      title: (
        <span className="audio-content-table-head">
          {intl.formatMessage(Messages.Text_Common_Name)}
        </span>
      ),
      width: "30%",
      dataIndex: "name",
      key: "name",
      render: (text) => {
        return <span className="table-content">{text}</span>;
      },
    },
    {
      title: (
        <span className="audio-content-table-head">
          {intl.formatMessage(Messages.Text_Common_Description)}
        </span>
      ),
      width: "45%",
      dataIndex: "remark",
      key: "remark",
      render: (text) => {
        return <span className="table-content">{text}</span>;
      },
    },
    {
      title: (
        <span className="audio-content-table-head">
          {intl.formatMessage(Messages.Text_Button_Operation)}
        </span>
      ),
      width: "25%",
      key: "operate",
      dataIndex: "state",
      render: (text, record) => (
        <div>
          <Button
            type="text"
            // className={
            //   situationActivated.includes(record.id)
            //     ? "situation-card-pause-btn"
            //     : "situation-card-play-btn"
            // }
            key={`play.${record.id}`}
            disabled={situationActivated.includes(record.id)}
            onClick={() => startSituation(record.id)}
          >
            <img
              alt="play"
              src={
                situationActivated.includes(record.id) ? PauseIcon : PlayIcon
              }
              className="audio-content-table-icon"
            />
          </Button>
          <Button
            type="text"
            id={record.id}
            key={`edit.${record.id}`}
            onClick={(event) => {
              onClickEditBtn(event);
            }}
            className="table-content"
          >
            <img
              alt="edit"
              src={PencilIcon}
              className="audio-content-table-icon"
            />
          </Button>
          <Button
            type="text"
            id={record.id}
            key={`remove.${record.id}`}
            onClick={(event) => {
              deleteSituation(event);
            }}
            className="table-content"
          >
            <img
              alt="remove"
              src={TrashIcon}
              className="audio-content-table-icon"
            />
          </Button>
        </div>
      ),
    },
  ];

  const detailColumns = [
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_Common_Step)}
        </span>
      ),
      dataIndex: "orderNum",
      key: "orderNum",
      width: "100px",
      render: (text) => <span className="table-content">{text}</span>,
    },
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
      width: "120px",
      dataIndex: "id",
      key: "operate",
      render: (text, record) => {
        return (
          <div key={`${text}-action`}>
            <Button
              key={`${text}-delete`}
              id={text}
              type="text"
              onClick={() => {
                deleteSituationDetail(text);
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

  // For open situation detail model after create it
  const [extendSituationId, setExtendSituationId] = useState(null);
  useEffect(() => {
    let situationId = extendSituationId ? extendSituationId : editSituation?.id;
    if (situationId && openSituationDetailModal) {
      (async () => {
        // set the edit situation
        let tempSituation;
        situations?.forEach((situation) => {
          if (situation.id === situationId) tempSituation = situation;
        });
        setEditSituation(tempSituation);

        // set the situation detail length
        let situationDetail = await getSituationDetails(store, situationId);
        let displayOrderNum = 1;
        let biggestSituationDetailOrder = 0;
        situationDetail?.forEach((detail) => {
          if (detail.orderNum > biggestSituationDetailOrder)
            biggestSituationDetailOrder = detail.orderNum;
          detail.orderNum = displayOrderNum++;
        });
        setEditSituationDetails(situationDetail);
        setSituationItemLength(biggestSituationDetailOrder);
      })();
    }
  }, [
    openSituationDetailModal,
    extendSituationId,
    situations,
    store,
    reload,
    editSituation?.id,
  ]);

  // add situation details
  const [isTVWallModalOpen, setIsTVWallModalOpen] = useState(false);
  const [isSingleScreenModalOpen, setIsSingleScreenModalOpen] = useState(false);
  const [isUSBModalOpen, setIsUSBModalOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);

  const handleMenuClick = (event) => {
    if (event.key === "tvwall") setIsTVWallModalOpen(true);
    else if (event.key === "singlescreen") setIsSingleScreenModalOpen(true);
    else if (event.key === "usb") setIsUSBModalOpen(true);
    else if (event.key === "audio") setIsAudioModalOpen(true);
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

  // get encoders & decoders
  const [decoders, setDecoders] = useState([]);
  const [encoders, setEncoders] = useState([]);
  useEffect(() => {
    (async () => {
      const encoders = await getEncoders(store);
      const decoders = await getDecoders(store);
      encoders?.forEach((encoder) => {
        encoder.key = encoder.mac;
      });
      decoders?.forEach((decoder) => {
        decoder.key = decoder.mac;
      });
      setDecoders(decoders);
      setEncoders(encoders);
    })();
  }, [
    store,
    isTVWallModalOpen,
    isSingleScreenModalOpen,
    isUSBModalOpen,
    isAudioModalOpen,
  ]);

  return (
    <div
      className={
        store.siderCollapse
          ? `page-layout-column-collapse`
          : `page-layout-column`
      }
    >
      <div>
        <div className="status-title-row">
          <span className="page-title">
            <FormattedMessage {...Messages.Text_Situation_Title} />
          </span>
          {/* <Input
            className="status-title-input status-input"
            variant="filled"
            onChange={(e) => {
              setSearchFilter(e.target.value);
            }}
            prefix={<SearchOutlined />}
            placeholder={intl.formatMessage(
              Messages.Text_DeviceStatus_InputDeviceName
            )}
          /> */}
          <div>
            <Button
              onClick={() => setIsSituationModalOpen(true)}
              className="create-situation-btn"
            >
              <img
                alt="create"
                src={PlusIcon}
                className="create-situation-btn-icon"
              />
              <span className="create-situation-btn-text">
                <FormattedMessage
                  {...Messages.Text_Situation_CreateSituation}
                />
              </span>
            </Button>
            <CreateSituation
              setReload={setReload}
              isModalOpen={isSituationModalOpen}
              setIsModalOpen={setIsSituationModalOpen}
              setExtendSituationId={setExtendSituationId}
              setExtendSituationDetail={setOpenSituationDetailModal}
            />
          </div>
        </div>
        <div className="status-content-container">
          <Table
            columns={columns}
            dataSource={situations}
            pagination={{ pageSize: 9 }}
            rowKey={(record) => record.id}
          />
          <Modal
            width={1080}
            open={openSituationDetailModal}
            onCancel={() => {
              setOpenSituationDetailModal(false);
            }}
            footer={
              // <Button
              //   onClick={}
              //   style={{ marginRight: 20 }}
              // >
              //   <FormattedMessage
              //     {...Messages.Text_Situation_CreateSituation}
              //   />
              // </Button>
              <Button
                type="text"
                onClick={() => setOpenSituationDetailModal(false)}
                className="situation-finish-btn"
              >
                <span className="situation-finish-btn-text">
                  <FormattedMessage {...Messages.Text_Common_Finish} />
                </span>
              </Button>
            }
          >
            <div className="situation-detail">
              <div className="situation-title-row">
                <div className="situation-card-title">
                  <FormattedMessage
                    {...Messages.Text_Situation_SituationName}
                  />
                  {`: ${editSituation?.name}`}
                </div>
              </div>
              <div className="situation-description">
                <FormattedMessage {...Messages.Text_Common_Description} />
                {`: ${editSituation?.remark}`}
              </div>
              <div>
                <Table
                  columns={detailColumns}
                  dataSource={editSituationDetails}
                  pagination={false}
                  rowKey={(record) => record.orderNum}
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
                <TVWallModal
                  situation={editSituation}
                  situationItemLength={situationItemLength}
                  isModalOpen={isTVWallModalOpen}
                  setIsModalOpen={setIsTVWallModalOpen}
                  setReload={setReload}
                  encoders={encoders}
                  setEncoders={setEncoders}
                  decoders={decoders}
                  setDecoders={setDecoders}
                />
                <SingleScreenModal
                  situation={editSituation}
                  situationItemLength={situationItemLength}
                  isModalOpen={isSingleScreenModalOpen}
                  setIsModalOpen={setIsSingleScreenModalOpen}
                  setReload={setReload}
                  encoders={encoders}
                  setEncoders={setEncoders}
                  decoders={decoders}
                  setDecoders={setDecoders}
                />
                <USBModal
                  situation={editSituation}
                  situationItemLength={situationItemLength}
                  isModalOpen={isUSBModalOpen}
                  setIsModalOpen={setIsUSBModalOpen}
                  setReload={setReload}
                  encoders={encoders}
                  setEncoders={setEncoders}
                  decoders={decoders}
                  setDecoders={setDecoders}
                />
                <AudioModal
                  situation={editSituation}
                  situationItemLength={situationItemLength}
                  isModalOpen={isAudioModalOpen}
                  setIsModalOpen={setIsAudioModalOpen}
                  setReload={setReload}
                  encoders={encoders}
                  setEncoders={setEncoders}
                  decoders={decoders}
                  setDecoders={setDecoders}
                />
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Situation;
