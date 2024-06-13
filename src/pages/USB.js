import React, { useContext, useEffect, useRef, useState } from "react";
import { StoreContext } from "../components/store/store";
import {
  Button,
  Col,
  Divider,
  Input,
  Modal,
  Radio,
  Row,
  Table,
  Tag,
  Typography,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  createDeviceLink,
  removeDeviceLink,
  getDeviceLinks,
  getDeviceLinkDetails,
  getDeviceLinkByEncoder,
  getDecoders,
  getEncoders,
} from "../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
} from "../utils/Utils";
import PlusIcon from "../assets/plus.png";
import CaretLeftIcon from "../assets/caret-left.png";
import PencilIcon from "../assets/pencil.png";
import TrashIcon from "../assets/trash.png";
import SearchIcon from "../assets/magnifying-glass.png";
import "../App.scss";
import "./USB.scss";
import { render } from "@testing-library/react";

const USB = () => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [pageType, setPageType] = useState("CONN_STATE"); // CONN_STATE, ADD_LINK, EDIT_LINK
  const [decoders, setDecoders] = useState([]);
  const [encoders, setEncoders] = useState([]);
  const [deviceLinks, setDeviceLinks] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [linkData, setLinkData] = useState([]);
  const [reload, setReload] = useState(null);

  const [encoderType, setEncoderType] = useState("1");
  const [decoderDict, setDecoderDict] = useState({}); // { $mac: { nickName: $nickName, mac: $mac... } }
  const [encoderDict, setEncoderDict] = useState({});
  const [decoderElements, setDecoderElements] = useState([]);
  const [encoderElements, setEncoderElements] = useState([]);
  const [choosedDecoderList, setChoosedDecoderList] = useState([]);
  const [choosedDecoderElements, setChoosedDecoderElements] = useState(null);
  const [choosedEncoder, setChoosedEncoder] = useState(null);

  useEffect(() => {
    (async () => {
      const encoders = await getEncoders(store);
      const decoders = await getDecoders(store);
      const deviceLinks = await getDeviceLinks({
        store: store,
        linkType: "usb",
        isPreset: "N",
      });
      console.log(deviceLinks, "ddd");
      encoders.forEach((encoder) => {
        encoder.key = encoder.mac;
      });
      decoders.forEach((decoder) => {
        decoder.key = decoder.mac;
      });
      setDecoders(decoders);
      setFilteredDecoders(decoders);
      setEncoders(encoders);
      setFilteredEncoders(encoders);
      setDeviceLinks(deviceLinks);
      setLinkData([]);
    })();
  }, [reload]);

  useEffect(() => {
    setLinkData([]);
    let tempLinkData = [];
    deviceLinks.forEach(async (deviceLink) => {
      let encoderName;
      encoders.some((encoder) => {
        if (
          encoder.mac === deviceLink.encoder &&
          encoder.nickName.includes(searchFilter)
        ) {
          encoderName = encoder.nickName;
          return true;
        } else return false;
      });
      let linkDetail = await getDeviceLinkDetails({
        store: store,
        linkId: deviceLink.id,
      });
      linkDetail.forEach((link) => {
        decoders.some((decoder) => {
          if (encoderName && decoder.mac === link.decoder) {
            tempLinkData.push({
              encoderMac: deviceLink.encoder,
              encoderName: encoderName,
              decoderMac: link.decoder,
              decoderName: decoder.nickName,
            });
            setLinkData(tempLinkData);
            return true;
          } else return false;
        });
      });
    });
  }, [deviceLinks, searchFilter]);

  const handleRemoveLink = async (encoderMac, decoderMac) => {
    let linkId;
    deviceLinks.some((link) => {
      if (link.encoder === encoderMac) {
        linkId = link.id;
        return true;
      } else return false;
    });
    if (linkId) {
      let linkDetail = await getDeviceLinkDetails({
        store: store,
        linkId: linkId,
      });
      let linkDecoders = [];
      linkDetail.forEach((link) => {
        if (decoderMac !== link.decoder) linkDecoders.push(link.decoder);
      });
      await removeDeviceLink({
        store: store,
        linkId: linkId,
      });
      if (linkDecoders)
        await createDeviceLink({
          store: store,
          id: `usb.${encoderMac}`,
          linkType: "usb",
          encoder: encoderMac,
          decoders: linkDecoders,
          value1: "usb",
          remark: "",
          isPreset: "N",
        });
      setReload(Math.random());
    }
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
          {intl.formatMessage(Messages.Text_Common_Model)}
        </span>
      ),
      dataIndex: "decoderName",
      key: "decoderName",
      render: (text) => {
        return <span style={{ fontSize: "16px" }}>{text}</span>;
      },
    },
    // {
    //   title: (
    //     <span style={{ fontSize: "16px", fontFamily: "PingFangTC" }}>
    //       {intl.formatMessage(Messages.Text_DeviceStatus_State)}
    //     </span>
    //   ),
    //   key: "state",
    //   dataIndex: "state",
    //   sorter: (a, b) => a.state.length - b.state.length,
    //   render: (_, { state, name }) => <></>,
    // },
    {
      title: (
        <span className="usb-content-table-head">
          {intl.formatMessage(Messages.Text_USB_Operation)}
        </span>
      ),
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
              linkData.forEach((link) => {
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
            onClick={() =>
              handleRemoveLink(record.encoderMac, record.decoderMac)
            }
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

  const choosedDecoderListRef = useRef();
  choosedDecoderListRef.current = choosedDecoderList;

  const changeEncoderType = ({ target: { value } }) => {
    setEncoderType(value);
  };

  const setDeviceState = (devices, setState) => {
    let tempDeviceDict = {};
    devices.forEach((device) => {
      tempDeviceDict[device.mac] = device;
    });
    setState(tempDeviceDict);
  };

  // set devices dict state
  useEffect(() => {
    (async () => {
      const decoders = await getDecoders(store);
      setDeviceState(decoders, setDecoderDict);
      const encoders = await getEncoders(store);
      setDeviceState(encoders, setEncoderDict);
    })();
  }, []);

  // Set "decoder list" when search filter is changed
  useEffect(() => {
    let tempDecoderElements = [];
    for (const [, decoder] of Object.entries(decoderDict)) {
      tempDecoderElements.push(
        <Row key={decoder.mac}>
          <Button
            key={decoder.mac}
            id={decoder.mac}
            nickname={decoder.nickName}
            type="text"
            size="small"
            style={{
              cursor: "pointer",
              backgroundColor: choosedDecoderList.includes(decoder.mac)
                ? "#BFE0E4"
                : null,
            }}
            className="tvwall-encoder"
            onClick={(event) => {
              if (decoder.state === "Up") {
                const mac = event.currentTarget.id;
                const nickName = event.currentTarget.nickname;
                handleChooseDecoder(mac, nickName);
              }
            }}
          >
            <span
              className={
                decoder.state === "Up"
                  ? "encoder-normal-dot"
                  : decoder.state === "Down"
                  ? "encoder-down-dot"
                  : "encoder-abnormal-dot"
              }
            />
            {decoder.nickName}
          </Button>
        </Row>
      );
    }
    setDecoderElements(tempDecoderElements);
  }, [searchFilter, choosedDecoderList, decoderDict]);

  // Set "encoder list" when search filter is changed
  useEffect(() => {
    let filterEncoders = [];
    for (const [, encoder] of Object.entries(encoderDict)) {
      if (
        encoder.mac.includes(searchFilter) ||
        encoder.nickName.includes(searchFilter)
      )
        filterEncoders.push(encoder);
    }

    let tempEncoderElements = [];
    filterEncoders.forEach((encoder) => {
      // get link of clicked encoders
      if (choosedEncoder === encoder.mac) {
        (async () => {
          let result = await getDeviceLinkByEncoder({
            store: store,
            linkId: `usb.` + choosedEncoder,
          });
          let tempDecoderList = [];
          if (result) {
            result.forEach((detail) => {
              tempDecoderList.push(detail.decoder);
            });
          }
          setChoosedDecoderList(tempDecoderList);
        })();
      }

      // display encoders & change background of encoder if clicked
      tempEncoderElements.push(
        <Row key={encoder.mac} style={{ marginTop: "6px" }}>
          <Button
            key={encoder.mac}
            id={encoder.mac}
            value={encoder.previewUrl}
            type="text"
            size="small"
            style={{
              cursor: "pointer",
              backgroundColor:
                choosedEncoder === encoder.mac ? "#BFE0E4" : null,
            }}
            className="tvwall-encoder"
            onClick={(event) => {
              const encoderName = event.currentTarget.id;
              if (encoder.state === "Up") handleChooseEncoder(encoderName);
            }}
          >
            <span
              className={
                encoder.state === "Up"
                  ? "encoder-normal-dot"
                  : encoder.state === "Down"
                  ? "encoder-down-dot"
                  : "encoder-abnormal-dot"
              }
            />
            {encoder.nickName}
          </Button>
        </Row>
      );
    });
    setEncoderElements(tempEncoderElements);
  }, [choosedEncoder, encoderDict, searchFilter]);

  const handleChooseDecoder = (decoderMac, decoderNickName) => {
    const decoderList = choosedDecoderListRef.current;
    if (decoderList.includes(decoderMac)) {
      // remove decoder from list
      setChoosedDecoderList((choosedDecoderList) => {
        return choosedDecoderList.filter((decoder) => decoder !== decoderMac);
      });
    } else {
      // add decoder to list
      setChoosedDecoderList((choosedDecoderList) => [
        ...choosedDecoderList,
        decoderMac,
      ]);
    }
  };

  const handleChooseEncoder = (encoderName) => {
    setChoosedEncoder(encoderName);
  };

  useEffect(() => {
    let tempChoosedDecoderElements = [];
    choosedDecoderList.forEach((decoder) => {
      tempChoosedDecoderElements.push(
        <Row key={decoder} style={{ marginTop: "6px" }}>
          <span key={decoder}>{decoderDict[decoder].nickName}</span>
        </Row>
      );
    });
    setChoosedDecoderElements(tempChoosedDecoderElements);
  }, [choosedDecoderList]);

  const handleCancel = () => {
    setChoosedDecoderList([]);
    setChoosedEncoder();
  };

  const handleClearConnection = async () => {
    if (choosedEncoder) {
      const result = await removeDeviceLink({
        store: store,
        linkId: `usb.` + choosedEncoder,
      });
      if (result) {
        setChoosedDecoderList([]);
        setChoosedEncoder();
        showSuccessNotificationByMsg(
          intl.formatMessage(Messages.Text_USB_ClearConnectionSuccess)
        );
      } else {
        showWarningNotification(
          intl.formatMessage(Messages.Text_USB_ClearConnectionFail)
        );
      }
    }
  };

  const handleCreateConnection = async () => {
    if (choosedDecoderList.length > 0 && choosedEncoder) {
      const result = await createDeviceLink({
        store: store,
        id: `usb.` + choosedEncoder,
        linkType: "usb",
        encoder: choosedEncoder,
        decoders: choosedDecoderList,
        remark: "",
        isPreset: "N",
      });
      if (result) {
        showSuccessNotificationByMsg(
          intl.formatMessage(Messages.Text_USB_CreateConnectionSuccess)
        );
      } else {
        showWarningNotification(
          intl.formatMessage(Messages.Text_USB_CreateConnectionFail)
        );
      }
    }
  };

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
    if (encoders.length !== 0) {
      encoders.forEach((encoder) => {
        if (encoder.nickName.includes(encoderFilter))
          tempFilteredEncoders.push(encoder);
      });
    }
    setFilteredEncoders(tempFilteredEncoders);
  }, [encoderFilter]);

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
    if (decoders.length !== 0) {
      decoders.forEach((decoder) => {
        if (decoder.nickName.includes(decoderFilter))
          tempFilteredDecoders.push(decoder);
      });
    }
    setFilteredEncoders(tempFilteredDecoders);
  }, [decoderFilter]);

  const decoderSelection = {
    selectedRowKeys: selectedDecoders,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedDecoders(selectedRowKeys);
    },
    getCheckboxProps: (record) => {
      const hasSelectedEncoder = selectedEncoder !== null;
      return { disabled: !hasSelectedEncoder };
    },
  };

  const handleAddDeviceLink = async () => {
    await createDeviceLink({
      store: store,
      id: `usb.${selectedEncoder}`,
      linkType: "usb",
      encoder: selectedEncoder,
      decoders: selectedDecoders,
      value1: "usb",
      remark: "",
      isPreset: "N",
    });
    setReload(Math.random());
    setPageType("CONN_STATE");
  };

  return (
    <div
      className={
        store.siderCollapse
          ? `page-layout-column-collapse`
          : `page-layout-column`
      }
    >
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
          <div className="usb-content-container">
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
                <img
                  alt="create"
                  src={PlusIcon}
                  className="usb-content-create-button-icon"
                />
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
              columns={columns}
              dataSource={linkData}
              pagination={false}
              size={"small"}
              onRow={(record) => ({
                onClick: () => {
                  handleChooseEncoder(record);
                },
              })}
            />
          </div>
        ) : (
          <div className="usb-content-container">
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
              <div id="encoder-selection">
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
                  <FormattedMessage {...Messages.Text_USB_ChooseSource} /> (
                  <FormattedMessage {...Messages.Text_Common_Encoder} />)
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
                  columns={encoderSelectionColumns}
                  dataSource={filteredEncoders}
                  rowSelection={{
                    type: "radio",
                    ...encoderSelection,
                  }}
                  pagination={false}
                />
              </div>
              <div style={{ width: "100px" }}></div>
              <div id="decoder-selection">
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
                  <FormattedMessage {...Messages.Text_USB_ChooseDestination} />{" "}
                  (
                  <FormattedMessage {...Messages.Text_Common_Decoder} />)
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
                  columns={decoderSelectionColumns}
                  dataSource={filteredDecoders}
                  rowSelection={{
                    type: "checkbox",
                    ...decoderSelection,
                  }}
                  pagination={false}
                />
                <Button
                  className="usb-add-btn"
                  disabled={!selectedEncoder || selectedDecoders.length === 0}
                  onClick={handleAddDeviceLink}
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
                        {...Messages.Text_Button_Edit}
                      />
                    )}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default USB;
