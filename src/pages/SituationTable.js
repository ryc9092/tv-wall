import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Table, Modal, Popconfirm } from "antd";
import { StoreContext } from "../components/store/store";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import CreateSituation from "../components/situation/createSituation";
import {
  getEncoders,
  getDecoders,
  getLocalUSBs,
  getRemoteUSBs,
  getSituations,
  getSituationDetails,
  removeSituation,
  activateSituation,
  removeSituationDetail,
} from "../api/API";
import ConfirmModal from "../components/common/confirmModal";
import TVWallModal from "../components/situation/tvWallModal";
import SingleScreenModal from "../components/situation/singlescreenModal";
import USBModal from "../components/situation/usbModal";
import AudioModal from "../components/situation/audioModal";
import AudioSituationModal from "../components/situation/audioSituationModal";
import TVWallViewModal from "../components/tvwall/situationTvWallView";
import USBViewModal from "../components/usb/usbViewModal";
import SingleScreenViewModal from "../components/singleScreen/singleScreenViewModal";
import AudioViewHintModal from "../components/audio/audioViewHintModal";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
} from "../utils/Utils";
import PlayIcon from "../assets/play-black.png";
import PauseIcon from "../assets/pause.png";
import ViewIcon from "../assets/view.png";
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

import useWindowDimensions from "../utils/WindowDimension";

const normalSituationCategory = "1";
const audioSituationCategory = "2";
let situationActivatedList = []; // for set activate situation list immediately

const Situation = () => {
  const intl = useIntl();
  const { height } = useWindowDimensions();
  const navigate = useNavigate();
  const [store] = useContext(StoreContext);
  const [reload, setReload] = useState(null);
  const [isSituationModalOpen, setIsSituationModalOpen] = useState(false);

  // get situations on reload
  const [situations, setSituations] = useState([]);
  const [situationItemLength, setSituationItemLength] = useState(0);
  useEffect(() => {
    (async () => {
      const situations = await getSituations(store, normalSituationCategory);
      setSituations(situations);
    })();
  }, [reload, store]);

  // play situation
  const [situationActivated, setSituationActivated] = useState([]);
  const startSituation = async (situationId) => {
    activateSituation(situationId, store).then((result) => {
      if (result) {
        showSuccessNotificationByMsg(
          <span>
            {intl.formatMessage(Messages.Text_Situation_PlaySuccess, {
              name: situations.find((situation) => situation.id === situationId)
                .name,
            })}
          </span>,
          Math.random()
        );
      } else {
        showWarningNotification(
          <span>
            {intl.formatMessage(Messages.Text_Situation_PlayFail, {
              name: situations.find((situation) => situation.id === situationId)
                .name,
            })}
            <br />
            {intl.formatMessage(Messages.Text_Situation_PlayFailHint)}
          </span>,
          Math.random()
        );
      }
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

  const deleteSituation = async (situationId) => {
    await removeSituation(situationId, store);
    setOpenConfirmModal(false);
    setReload(Math.random());
  };

  const deleteSituationDetail = async (situationDetailId) => {
    await removeSituationDetail(situationDetailId, store);
    setReload(Math.random());
  };

  // view various connections
  const [isTVWallViewModalOpen, setIsTVWallViewModalOpen] = useState(false);
  const [isUSBViewModalOpen, setIsUSBViewModalOpen] = useState(false);
  const [isSingleScreenViewModalOpen, setIsSingleScreenViewModalOpen] =
    useState(false);
  const [isAudioViewModalOpen, setIsAudioViewModalOpen] = useState(false);
  const [choosedSituationDetailId, setChoosedSituationDetailId] =
    useState(null);
  const [linkType, setLinkType] = useState(null);
  const viewSituationDetail = async (situationDetailRelationId, type) => {
    setChoosedSituationDetailId(situationDetailRelationId);
    setLinkType(type);
    if (type === "usb") setIsUSBViewModalOpen(true);
    else if (type === "subPreset") setIsAudioViewModalOpen(true);
    else if (type === "video") setIsSingleScreenViewModalOpen(true);
    // else if (type === "tvwall") setIsTVWallViewModalOpen(true);
    else if (type === "tvwall") console.log("tvwall");
  };

  useEffect(() => {
    if (
      !isUSBViewModalOpen &&
      !isSingleScreenViewModalOpen &&
      !isAudioViewModalOpen &&
      !isTVWallViewModalOpen
    )
      setChoosedSituationDetailId(null);
  }, [
    isTVWallViewModalOpen,
    isUSBViewModalOpen,
    isSingleScreenViewModalOpen,
    isAudioViewModalOpen,
  ]);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [deleteSituationId, setDeleteSituationId] = useState(null);
  const columns = [
    {
      title: (
        <span className="audio-content-table-head">
          {intl.formatMessage(Messages.Text_Common_Name)}
        </span>
      ),
      width: "23%",
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
      width: "32%",
      dataIndex: "remark",
      key: "remark",
      render: (text) => {
        return <span className="table-content">{text}</span>;
      },
    },
    {
      title: (
        <span className="audio-content-table-head">
          {intl.formatMessage(Messages.Text_Situation_LastExecTime)}
        </span>
      ),
      width: "20%",
      dataIndex: "LastExecDateTime",
      key: "LastExecDateTime",
      render: (text) => {
        let executeTime;
        if (text !== 0) {
          const date = new Date(text);
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const seconds = date.getSeconds();
          executeTime =
            date.getFullYear() +
            "-" +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + date.getDate()).slice(-2) +
            " " +
            ("0" + hours).slice(-2) +
            ":" +
            ("0" + minutes).slice(-2) +
            ":" +
            ("0" + seconds).slice(-2);
        }
        return (
          <span className="table-content">
            {executeTime
              ? executeTime
              : intl.formatMessage(Messages.Text_Situation_NotExecuted)}
          </span>
        );
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
        <div style={{ width: 155 }}>
          <Button
            type="text"
            className={
              situationActivated.includes(record.id)
                ? "situation-pause-btn"
                : ""
            }
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
          {/* <Popconfirm
            id={`confirm-${record.id}`}
            title={
              <span className="pop-confirm-text">
                {intl.formatMessage(Messages.Text_Sidebar_SituationManagement)}
              </span>
            }
            description={
              <span className="pop-confirm-text">
                {intl.formatMessage(Messages.Text_Situation_DeleteConfirm)}
              </span>
            }
            okText={intl.formatMessage(Messages.Text_Common_Confirm)}
            cancelText={intl.formatMessage(Messages.Text_Button_Cancel)}
            onConfirm={() => {
              deleteSituation(record.id);
            }}
          > */}
          <Button
            type="text"
            id={record.id}
            key={`remove.${record.id}`}
            className="table-content"
            onClick={() => {
              setDeleteSituationId(record.id);
              setOpenConfirmModal(true);
            }}
          >
            <img
              alt="remove"
              src={TrashIcon}
              className="audio-content-table-icon"
            />
          </Button>
          {/* </Popconfirm> */}
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
          {intl.formatMessage(Messages.Text_Common_ItemName)}
        </span>
      ),
      dataIndex: "set_type",
      key: "type",
      render: (text) => (
        <span className="table-content">
          {intl.formatMessage(Messages[`Text_Situation_Item${text}`])}
        </span>
      ),
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
        return <div className="table-content situation-remark-col">{text}</div>;
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
          <div
            key={`${text}-action`}
            style={{ display: "inline", whiteSpace: "nowrap" }}
          >
            <Button
              key={`${text}-view`}
              type="text"
              onClick={() => {
                viewSituationDetail(record.relation_id, record.set_type);
              }}
              className="table-content"
            >
              <img
                alt="view"
                src={ViewIcon}
                className="table-content-icon"
                style={{ opacity: 0.6 }}
              />
            </Button>
            <Button
              key={`${text}-delete`}
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
  const [isAudioSituationModalOpen, setIsAudioSituationModalOpen] =
    useState(false);
  const [openNoAudioHintModal, setOpenNoAudioHintModal] = useState(false);

  const handleMenuClick = (event) => {
    if (event.key === "tvwall") setIsTVWallModalOpen(true);
    else if (event.key === "singlescreen") setIsSingleScreenModalOpen(true);
    else if (event.key === "usb") setIsUSBModalOpen(true);
    else if (event.key === "audio") {
      (async () => {
        const audioSituations = await getSituations(
          store,
          audioSituationCategory
        );
        if (audioSituations?.length === 0) setOpenNoAudioHintModal(true);
        else setIsAudioSituationModalOpen(true);
      })();
    }
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
          {intl.formatMessage(Messages.Text_Situation_AudioConnection)}
        </span>
      ),
      key: "audio",
      icon: <img src={AudioIcon} alt="audio" className="dropdown-menu-icon" />,
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
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  // get encoders & decoders
  const [decoders, setDecoders] = useState([]);
  const [encoders, setEncoders] = useState([]);
  const [usbDecoders, setUsbDecoders] = useState([]);
  const [usbEncoders, setUsbEncoders] = useState([]);
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

      const usbEncoders = await getLocalUSBs(store, editSituation?.id);
      const usbDecoders = await getRemoteUSBs(store, editSituation?.id);
      usbEncoders?.forEach((encoder) => {
        encoder.key = encoder.mac;
      });
      usbDecoders?.forEach((decoder) => {
        decoder.key = decoder.mac;
      });
      setUsbDecoders(usbDecoders);
      setUsbEncoders(usbEncoders);
    })();
  }, [
    store,
    editSituation,
    isTVWallModalOpen,
    isSingleScreenModalOpen,
    isUSBModalOpen,
    isAudioSituationModalOpen,
  ]);

  const confirmModalContent = (
    <div>
      <div>
        <span style={{ marginRight: 12 }}>
          <FormattedMessage {...Messages.Text_Situation_SituationName} />
          {" : "}
          {
            situations?.find((situation) => situation.id === deleteSituationId)
              ?.name
          }
        </span>
      </div>
      <br />
      <span className="confirm-modal-confirm-text">
        <FormattedMessage {...Messages.Text_Situation_RemoveSituationConfirm} />
      </span>
      <br />
    </div>
  );

  return (
    <div className="page-layout-column">
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
        <div
          className={
            store.siderCollapse
              ? "situation-content-container-collapse"
              : "situation-content-container"
          }
        >
          <Table
            columns={columns}
            dataSource={situations}
            // size="small"
            pagination={{ pageSize: 10 }}
            rowKey={(record) => record.id}
            scroll={{ x: "max-content", y: height - 395 }}
          />
          <ConfirmModal
            open={openConfirmModal}
            setOpen={setOpenConfirmModal}
            onOk={() => {
              deleteSituation(deleteSituationId);
            }}
            width={460}
            title={
              <FormattedMessage {...Messages.Text_Situation_RemoveSituation} />
            }
            content={confirmModalContent}
          />
          <Modal
            className="situation-detail-modal close-x"
            open={openSituationDetailModal}
            onCancel={() => {
              setOpenSituationDetailModal(false);
              setExtendSituationId(null);
            }}
            footer={
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
                  className="situation-detail-table"
                  columns={detailColumns}
                  dataSource={editSituationDetails}
                  size={"small"}
                  pagination={false}
                  rowKey={(record) => record.orderNum}
                  scroll={{ x: "max-content", y: height - 420 }}
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
                  encoders={usbEncoders}
                  setEncoders={setUsbEncoders}
                  decoders={usbDecoders}
                  setDecoders={setUsbDecoders}
                />
                <AudioSituationModal
                  situation={editSituation}
                  situationItemLength={situationItemLength}
                  isModalOpen={isAudioSituationModalOpen}
                  setIsModalOpen={setIsAudioSituationModalOpen}
                  setReload={setReload}
                  encoders={encoders}
                  setEncoders={setEncoders}
                  decoders={decoders}
                  setDecoders={setDecoders}
                />
                <Modal
                  width={420}
                  open={openNoAudioHintModal}
                  onCancel={() => {
                    setOpenNoAudioHintModal(false);
                  }}
                  footer={
                    <Button
                      type="text"
                      onClick={() => setOpenNoAudioHintModal(false)}
                      className="situation-finish-btn"
                    >
                      <span className="situation-finish-btn-text">
                        <FormattedMessage {...Messages.Text_Button_Cancel} />
                      </span>
                    </Button>
                  }
                  title=<span className="no-audio-hint-modal-title">
                    {intl.formatMessage(Messages.Text_Situation_AddAudioHint)}
                  </span>
                >
                  <div className="no-audio-hint-modal-content">
                    <Button
                      type="text"
                      className="no-audio-hint-modal-content-btn"
                      onClick={() => {
                        navigate(`/audio`);
                        window.location.reload();
                      }}
                    >
                      <FormattedMessage
                        {...Messages.Text_Situation_GoAudioMgmt}
                      />
                    </Button>
                  </div>
                </Modal>
              </div>
            </div>
          </Modal>
        </div>
      </div>
      {isTVWallViewModalOpen === true &&
        choosedSituationDetailId !== undefined && (
          <TVWallViewModal
            situationDetailId={choosedSituationDetailId}
            situationItemLength={situationItemLength}
            isModalOpen={isTVWallViewModalOpen}
            setIsModalOpen={setIsTVWallViewModalOpen}
            setReload={setReload}
            encoders={encoders}
            setEncoders={setEncoders}
            decoders={decoders}
            setDecoders={setDecoders}
            type={linkType}
          />
        )}
      {isUSBViewModalOpen === true &&
        choosedSituationDetailId !== undefined && (
          <USBViewModal
            situationDetailId={choosedSituationDetailId}
            situationItemLength={situationItemLength}
            isModalOpen={isUSBViewModalOpen}
            setIsModalOpen={setIsUSBViewModalOpen}
            setReload={setReload}
            encoders={usbEncoders}
            setEncoders={setUsbEncoders}
            decoders={usbDecoders}
            setDecoders={setUsbDecoders}
            type={linkType}
          />
        )}
      {isSingleScreenViewModalOpen === true &&
        choosedSituationDetailId !== undefined && (
          <SingleScreenViewModal
            situationDetailId={choosedSituationDetailId}
            situationItemLength={situationItemLength}
            isModalOpen={isSingleScreenViewModalOpen}
            setIsModalOpen={setIsSingleScreenViewModalOpen}
            setReload={setReload}
            encoders={encoders}
            setEncoders={setEncoders}
            decoders={decoders}
            setDecoders={setDecoders}
            type={linkType}
          />
        )}
      {isAudioViewModalOpen === true &&
        choosedSituationDetailId !== undefined && (
          <AudioViewHintModal
            isModalOpen={isAudioViewModalOpen}
            setIsModalOpen={setIsAudioViewModalOpen}
          />
        )}
    </div>
  );
};

export default Situation;
