import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Input, Modal, Table, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  createDeviceLink,
  removeDeviceLink,
  getDeviceLinks,
  getLocalUSBs,
  getRemoteUSBs,
  // getEncoders,
  // getDecoders,
} from "../api/API";
import ConfirmModal from "../components/common/confirmModal";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import {
  showSuccessNotificationByMsg,
  showWarningNotification,
  sleep,
} from "../utils/Utils";
import PlusIcon from "../assets/plus.png";
import CaretLeftIcon from "../assets/caret-left.png";
import PencilIcon from "../assets/pencil.png";
import TrashIcon from "../assets/trash.png";
import SearchIcon from "../assets/magnifying-glass.png";
import "../App.scss";
import "./USB.scss";

import useWindowDimensions from "../utils/WindowDimension";

const USB = () => {
  const intl = useIntl();
  const { height } = useWindowDimensions();
  const [store] = useContext(StoreContext);
  const [pageType, setPageType] = useState("CONN_STATE"); // CONN_STATE, ADD_LINK, EDIT_LINK
  const [decoders, setDecoders] = useState([]);
  const [encoders, setEncoders] = useState([]);
  const [deviceLinks, setDeviceLinks] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [linkData, setLinkData] = useState([]);
  const [reload, setReload] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectEncoder, setSelectEncoder] = useState(null);
  const [selectDecoder, setSelectDecoder] = useState(null);

  useEffect(() => {
    (async () => {
      const encoders = await getLocalUSBs(store);
      const decoders = await getRemoteUSBs(store);
      // const encoders = await getEncoders(store);
      // const decoders = await getDecoders(store);
      const deviceLinks = await getDeviceLinks({
        store: store,
        linkType: "usb",
        isPreset: "N",
      });
      encoders?.forEach((encoder) => {
        encoder.key = encoder.mac;
      });
      decoders?.forEach((decoder) => {
        decoder.key = decoder.mac;
      });
      setDecoders(decoders);
      setFilteredDecoders(decoders);
      setEncoders(encoders);
      setFilteredEncoders(encoders);
      setDeviceLinks(deviceLinks);
      setLinkData([]);
    })();
  }, [reload, store]);

  useEffect(() => {
    setLinkData([]);
    let tempLinkData = [];
    deviceLinks?.forEach(async (deviceLink, index) => {
      let encoderName;
      encoders?.some((encoder) => {
        if (
          encoder.mac === deviceLink.encoder &&
          encoder.nickName.includes(searchFilter)
        ) {
          encoderName = encoder.nickName;
          return true;
        } else return false;
      });
      deviceLink?.deviceLinkDetails?.forEach((link) => {
        decoders?.some((decoder) => {
          if (encoderName && decoder.mac === link.decoder) {
            tempLinkData.push({
              key: `${deviceLink.encoder}.${link.decoder}`,
              encoderMac: deviceLink.encoder,
              encoderName: encoderName,
              decoderMac: link.decoder,
              decoderName: decoder.nickName,
            });
            return true;
          } else return false;
        });
      });
      if (index + 1 === deviceLinks.length) setLinkData(tempLinkData);
    });
    // let test = []
    // test.push({encoderMac: "123", encoderName: "123", decoderMac: "123", decoderName: "123"})
    // setLinkData(test);
  }, [decoders, deviceLinks, encoders, searchFilter]);

  const handleRemoveLink = async (encoderMac, decoderMac) => {
    const result = await removeDeviceLink({
      store: store,
      linkType: `usb`,
      encoder: encoderMac,
      decoders: [decoderMac],
    });
    if (result) {
      showSuccessNotificationByMsg(
        intl.formatMessage(Messages.Text_USB_ClearLinkSuccess, {
          source: encoders.find((encoder) => encoder.mac === encoderMac)
            .nickName,
          destination: decoders.find((decoder) => decoder.mac === decoderMac)
            .nickName,
        }),
        Math.random()
      );
    } else {
      showWarningNotification(
        <span>
          {intl.formatMessage(Messages.Text_USB_ClearLinkFail, {
            source: encoders.find((encoder) => encoder.mac === encoderMac)
              .nickName,
            destination: decoders.find((decoder) => decoder.mac === decoderMac)
              .nickName,
          })}
          <br />
          {intl.formatMessage(Messages.Text_USB_LinkFailHint)}
        </span>,
        Math.random()
      );
    }
    sleep(800).then(() => {
      setReload(Math.random());
    });
    setOpenConfirmModal(false);
  };

  const columns = [
    {
      title: (
        <span className="usb-content-table-head">
          {intl.formatMessage(Messages.Text_USB_Source)}
        </span>
      ),
      dataIndex: "encoderName",
      key: "encoderName",
      render: (text) => {
        return <span>{text}</span>;
      },
    },
    {
      title: (
        <span className="usb-content-table-head">
          {intl.formatMessage(Messages.Text_USB_Destination)}
        </span>
      ),
      dataIndex: "decoderName",
      key: "decoderName",
      render: (text) => {
        return <span style={{ fontSize: "16px" }}>{text}</span>;
      },
    },
    {
      title: (
        <span className="usb-content-table-head">
          {intl.formatMessage(Messages.Text_USB_Operation)}
        </span>
      ),
      width: "25%",
      key: "operate",
      dataIndex: "state",
      render: (text, record) => (
        <div>
          <Button
            type="text"
            onClick={() => {
              setPageType("EDIT_LINK");
              setSelectedEncoder(record.encoderMac);
              let linkedDecoders = [];
              linkData?.forEach((link) => {
                if (link.encoderMac === record.encoderMac)
                  linkedDecoders.push(link.decoderMac);
              });
              setSelectedDecoders(linkedDecoders);
            }}
          >
            <img
              alt="edit"
              src={PencilIcon}
              className="usb-content-table-icon"
            />
          </Button>
          <Button
            type="text"
            key={`remove.${record.decoderMac}`}
            onClick={() => {
              setSelectEncoder(record.encoderMac);
              setSelectDecoder(record.decoderMac);
              setOpenConfirmModal(true);
            }}
          >
            <img
              alt="remove"
              src={TrashIcon}
              className="usb-content-table-icon"
            />
          </Button>
        </div>
      ),
    },
  ];

  const [selectedEncoder, setSelectedEncoder] = useState([]);
  const [encoderFilter, setEncoderFilter] = useState("");
  const [filteredEncoders, setFilteredEncoders] = useState([]);

  const encoderSelectionColumns = [
    {
      title: (
        <span className="usb-content-table-head">
          {intl.formatMessage(Messages.Text_USB_Source)}
        </span>
      ),
      dataIndex: "nickName",
      key: "nickName",
      render: (text) => {
        return <span>{text}</span>;
      },
    },
    {
      title: (
        <span className="usb-content-table-head">
          {intl.formatMessage(Messages.Text_USB_Status)}
        </span>
      ),
      width: "30%",
      key: "state",
      dataIndex: "state",
      sorter: (a, b) => a.state.length - b.state.length,
      render: (_, { state, name }) => (
        <>
          {state === "Up" ? (
            <Tag color={"#eef9b4"} key={`${name}.${state}`}>
              <span style={{ color: "#a0b628" }}>
                <FormattedMessage {...Messages.Text_Common_Up} />
              </span>
            </Tag>
          ) : state === "Down" ? (
            <Tag color={"#ffe6e5"} key={`${name}.${state}`}>
              <span style={{ color: "#d55959" }}>
                <FormattedMessage {...Messages.Text_Common_Down} />
              </span>
            </Tag>
          ) : (
            <Tag color={"yellow"} key={`${name}.${state}`}>
              {state}
            </Tag>
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    let tempFilteredEncoders = [];
    if (encoders && encoders.length !== 0) {
      encoders?.forEach((encoder) => {
        if (encoder.nickName.includes(encoderFilter))
          tempFilteredEncoders.push(encoder);
      });
    }
    setFilteredEncoders(tempFilteredEncoders);
  }, [encoderFilter, encoders]);

  const encoderSelection = {
    selectedRowKeys: [selectedEncoder],
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedEncoder(selectedRowKeys[0]);
    },
    // getCheckboxProps: (record) => {
    //   let isConnected = false;
    //   if (deviceLinks.length !== 0) {
    //     deviceLinks.forEach((link) => {
    //       if (`usb.${record.mac}` === link.id) isConnected = true;
    //     });
    //   }
    //   return { disabled: isConnected, nickName: record.nickName };
    // },
  };

  const [selectedDecoders, setSelectedDecoders] = useState([]);
  const [decoderFilter, setDecoderFilter] = useState("");
  const [filteredDecoders, setFilteredDecoders] = useState([]);

  const decoderSelectionColumns = [
    {
      title: (
        <span className="usb-content-table-head">
          {intl.formatMessage(Messages.Text_USB_Destination)}
        </span>
      ),
      dataIndex: "nickName",
      key: "nickName",
      render: (text) => {
        return <span>{text}</span>;
      },
    },
    {
      title: (
        <span className="usb-content-table-head">
          {intl.formatMessage(Messages.Text_USB_Status)}
        </span>
      ),
      width: "30%",
      key: "state",
      dataIndex: "state",
      sorter: (a, b) => a.state.length - b.state.length,
      render: (_, { state, name }) => (
        <>
          {state === "Up" ? (
            <Tag color={"#eef9b4"} key={`${name}.${state}`}>
              <span style={{ color: "#a0b628" }}>
                <FormattedMessage {...Messages.Text_Common_Up} />
              </span>
            </Tag>
          ) : state === "Down" ? (
            <Tag color={"#ffe6e5"} key={`${name}.${state}`}>
              <span style={{ color: "#d55959" }}>
                <FormattedMessage {...Messages.Text_Common_Down} />
              </span>
            </Tag>
          ) : (
            <Tag color={"yellow"} key={`${name}.${state}`}>
              {state}
            </Tag>
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    let tempFilteredDecoders = [];
    if (decoders && decoders.length !== 0) {
      decoders?.forEach((decoder) => {
        if (decoder.nickName.includes(decoderFilter))
          tempFilteredDecoders.push(decoder);
      });
    }
    setFilteredDecoders(tempFilteredDecoders);
  }, [decoderFilter, decoders]);

  const decoderSelection = {
    selectedRowKeys: selectedDecoders,
    onChange: (selectedRowKeys, selectedRows) => {
      // selectedRowKeys.push('DE7-MonitorD') add default checked box
      setSelectedDecoders(selectedRowKeys);
    },
    getCheckboxProps: (record) => {
      const hasSelectedEncoder = selectedEncoder !== null;
      return { disabled: !hasSelectedEncoder };
      // return { disabled: record.nickName === "N-DE7-MonitorD" }; set disabled row
    },
  };

  const handleAddDeviceLink = async () => {
    let result = await createDeviceLink({
      store: store,
      id: `usb.${selectedEncoder}`,
      linkType: "usb",
      encoder: selectedEncoder,
      decoders: selectedDecoders,
      value1: "usb",
      remark: "",
      isPreset: "N",
    });
    if (result) {
      showSuccessNotificationByMsg(
        intl.formatMessage(Messages.Text_USB_LinkSuccess, {
          source: encoders.find((encoder) => encoder.mac === selectedEncoder)
            .nickName,
          destination: decoders.find(
            (decoder) => decoder.mac === selectedDecoders[0]
          ).nickName,
        }),
        Math.random()
      );
    } else {
      showWarningNotification(
        <span>
          {intl.formatMessage(Messages.Text_USB_LinkFail, {
            source: encoders.find((encoder) => encoder.mac === selectedEncoder)
              .nickName,
            destination: decoders.find(
              (decoder) => decoder.mac === selectedDecoders[0]
            ).nickName,
          })}
          <br />
          {intl.formatMessage(Messages.Text_USB_LinkFailHint)}
        </span>,
        Math.random()
      );
    }
    sleep(800).then(() => {
      setReload(Math.random());
    });
    setPageType("CONN_STATE");
  };

  const handleEditDeviceLink = async () => {
    let linkedDecoders = [];
    deviceLinks?.some((link) => {
      if (link.encoder === selectedEncoder) {
        link.detail?.forEach((decoder) => {
          linkedDecoders.push(decoder.decoder);
        });
        return true;
      } else return false;
    });

    try {
      const res1 = await removeDeviceLink({
        store: store,
        linkType: `usb`,
        encoder: selectedEncoder,
        decoders: linkedDecoders,
      });

      const res2 = await createDeviceLink({
        store: store,
        id: `usb.${selectedEncoder}`,
        linkType: "usb",
        encoder: selectedEncoder,
        decoders: selectedDecoders,
        value1: "",
        remark: "",
        isPreset: "N",
      });

      if (!res1 || !res2) throw new Error("call api failed");
      showSuccessNotificationByMsg(
        intl.formatMessage(Messages.Text_USB_LinkSuccess, {
          source: encoders.find((encoder) => encoder.mac === selectedEncoder)
            .nickName,
          destination: decoders.find(
            (decoder) => decoder.mac === selectedDecoders[0]
          ).nickName,
        }),
        Math.random()
      );
    } catch (error) {
      showWarningNotification(
        <span>
          {intl.formatMessage(Messages.Text_USB_LinkFail, {
            source: encoders.find((encoder) => encoder.mac === selectedEncoder)
              .nickName,
            destination: decoders.find(
              (decoder) => decoder.mac === selectedDecoders[0]
            ).nickName,
          })}
          <br />
          {intl.formatMessage(Messages.Text_USB_LinkFailHint)}
        </span>,
        Math.random()
      );
    }

    sleep(800).then(() => {
      setReload(Math.random());
    });
    setPageType("CONN_STATE");
  };

  const confirmModalContent = (
    <div>
      <div>
        <span style={{ marginRight: 12 }}>
          <FormattedMessage {...Messages.Text_Common_EncoderSimple} />
          {" : "}
          {encoders?.find((encoder) => encoder.mac === selectEncoder)?.nickName}
        </span>
        <span className="confirm-modal-arrow-line" />
        <span style={{ fontSize: 13, color: "black" }}>▶</span>
        <span style={{ marginLeft: 12 }}>
          <FormattedMessage {...Messages.Text_Common_DecoderSimple} />
          {" : "}
          {decoders?.find((decoder) => decoder.mac === selectDecoder)?.nickName}
        </span>
      </div>
      <br />
      <span className="confirm-modal-confirm-text">
        <FormattedMessage {...Messages.Text_USB_RemoveConnectionConfirm} />
      </span>
      <br />
    </div>
  );

  return (
    <div className="usb-layout-column">
      <div>
        <div className="usb-title-row">
          <span className="page-title">
            <FormattedMessage {...Messages.Text_USB_USBMgmt} />
          </span>
          {pageType === "CONN_STATE" ? (
            <Input
              className="usb-title-input usb-input"
              variant="filled"
              onChange={(e) => {
                setSearchFilter(e.target.value);
              }}
              prefix={<SearchOutlined />}
              placeholder={intl.formatMessage(Messages.Text_USB_InputUSBSource)}
            />
          ) : null}
        </div>
        {pageType === "CONN_STATE" ? (
          <div
            className={
              store.siderCollapse
                ? "usb-content-container-collapse"
                : "usb-content-container"
            }
          >
            <div className="usb-content-title-row">
              <span className="usb-content-title">
                <FormattedMessage {...Messages.Text_USB_ConnectionStatus} />
              </span>
              <Button
                shape="circle"
                className="usb-content-create-button"
                onClick={() => {
                  setPageType("ADD_LINK");
                  setSelectedEncoder(null);
                  setSelectedDecoders([]);
                  setReload(Math.random());
                }}
              >
                <div className="usb-content-create-button-wrapper">
                  <img
                    alt="create"
                    src={PlusIcon}
                    className="usb-content-create-button-icon"
                  />
                </div>
              </Button>
            </div>
            {/* <div className="usb-content-table-row ">
            <span className="usb-content-table-head">
              <FormattedMessage {...Messages.Text_USB_Source} />
            </span>
            <span className="usb-content-table-head">
              <FormattedMessage {...Messages.Text_USB_Destination} />
            </span>
            <span className="usb-content-table-head">
              <FormattedMessage {...Messages.Text_USB_Status} />
            </span>
            <span className="usb-content-table-head">
              <FormattedMessage {...Messages.Text_USB_Operation} />
            </span>
            </div>
            <Divider style={{ marginTop: 8 }} /> */}
            <Table
              className="usb-content-table"
              columns={columns}
              dataSource={linkData}
              scroll={{ x: "max-content", y: height - 440 }}
            />
            <ConfirmModal
              open={openConfirmModal}
              setOpen={setOpenConfirmModal}
              onOk={() => {
                handleRemoveLink(selectEncoder, selectDecoder);
              }}
              width={460}
              title={
                <FormattedMessage
                  {...Messages.Text_USB_RemoveConnectionTitle}
                />
              }
              content={confirmModalContent}
            />
          </div>
        ) : (
          <div
            className={
              store.siderCollapse
                ? "usb-content-container-add-connection-collapse"
                : "usb-content-container-add-connection"
            }
          >
            <div className="usb-add-title-row">
              <Button
                shape="circle"
                className="usb-add-link-button"
                onClick={() => setPageType("CONN_STATE")}
              >
                <img
                  alt="return"
                  src={CaretLeftIcon}
                  className="usb-add-link-icon"
                />
              </Button>
              <span className="usb-content-title">
                {pageType === "ADD_LINK" ? (
                  <FormattedMessage {...Messages.Text_USB_AddConnection} />
                ) : (
                  <FormattedMessage {...Messages.Text_USB_EditConnection} />
                )}
              </span>
            </div>
            <div className="usb-add-row">
              <div id="encoder-selection" className="usb-add-progress-column">
                <div className="usb-add-progress">
                  <div className="usb-add-progress-circle">
                    <span className="usb-add-progress-circle-text">1</span>
                  </div>
                  <div
                    className={
                      selectedEncoder
                        ? "usb-add-progress-bar-finished"
                        : "usb-add-progress-bar"
                    }
                  ></div>
                </div>
                <div className="usb-add-subtitle">
                  <FormattedMessage {...Messages.Text_USB_ChooseSource} />
                </div>
                <Input
                  className="usb-add-input usb-input usb-add-input-placeholder"
                  variant="filled"
                  onChange={(e) => {
                    setEncoderFilter(e.target.value);
                  }}
                  prefix={
                    <img
                      alt="search"
                      src={SearchIcon}
                      className="usb-add-input-prefix"
                    />
                  }
                  placeholder={intl.formatMessage(
                    Messages.Text_USB_InputEncoderName
                  )}
                />
                <Table
                  className="usb-connection-table"
                  columns={encoderSelectionColumns}
                  dataSource={filteredEncoders}
                  // onRow={(record) => ({
                  //   onClick: () => {
                  //     setSelectedEncoder(record?.mac);
                  //   },
                  // })}
                  rowSelection={{
                    columnWidth: 50,
                    type: "radio",
                    ...encoderSelection,
                  }}
                  size={"small"}
                  pagination={false}
                  scroll={{ x: "max-content", y: height - 595 }}
                />
              </div>
              <div className="usb-add-container-interval" />
              <div id="decoder-selection" className="usb-add-progress-column">
                <div className="usb-add-progress">
                  <div
                    className={
                      selectedEncoder
                        ? "usb-add-progress-circle"
                        : "usb-add-progress-circle-unstarted"
                    }
                  >
                    <span className="usb-add-progress-circle-text">2</span>
                  </div>
                  <div
                    className={
                      selectedDecoders.length !== 0
                        ? "usb-add-progress-bar-finished"
                        : "usb-add-progress-bar"
                    }
                  ></div>
                </div>
                <div className="usb-add-subtitle">
                  <FormattedMessage {...Messages.Text_USB_ChooseDestination} />
                </div>
                <Input
                  className="usb-add-input usb-input usb-add-input-placeholder"
                  variant="filled"
                  onChange={(e) => {
                    setDecoderFilter(e.target.value);
                  }}
                  prefix={
                    <img
                      alt="search"
                      src={SearchIcon}
                      className="usb-add-input-prefix"
                    />
                  }
                  placeholder={intl.formatMessage(
                    Messages.Text_USB_InputDecoderName
                  )}
                />
                <Table
                  className="usb-connection-table"
                  columns={decoderSelectionColumns}
                  dataSource={filteredDecoders}
                  rowSelection={{
                    columnWidth: 50,
                    type: "radio",
                    ...decoderSelection,
                  }}
                  size={"small"}
                  pagination={false}
                  scroll={{ x: "max-content", y: height - 595 }}
                />
                <div style={{ display: "flex", justifyContent: "end", marginTop: 10 }}>
                  <Button
                    className="usb-cancel-btn"
                    onClick={() => setPageType("CONN_STATE")}
                  >
                    <span className="usb-cancel-btn-text">
                      <FormattedMessage {...Messages.Text_Button_Cancel} />
                    </span>
                  </Button>
                  <Button
                    className="usb-add-btn"
                    disabled={!selectedEncoder || selectedDecoders.length === 0}
                    onClick={
                      pageType === "ADD_LINK"
                        ? handleAddDeviceLink
                        : handleEditDeviceLink
                    }
                  >
                    <span className="usb-add-btn-text">
                      {pageType === "ADD_LINK" ? (
                        <FormattedMessage
                          className="usb-add-btn-text"
                          {...Messages.Text_Button_Add}
                        />
                      ) : (
                        <FormattedMessage
                          className="usb-add-btn-text"
                          {...Messages.Text_Common_Confirm}
                        />
                      )}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default USB;
