import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../components/store/store";
import { Button, Divider, Input, Modal, Table, Tag } from "antd";
import { getEncoders, getDecoders, presetDeviceLink } from "../../api/API";
import { uuid } from "../../utils/Utils";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../messages";
import SearchIcon from "../../assets/magnifying-glass.png";
import "./addSituationContent.scss";
import "./usbModal.scss";

const USBModal = ({
  situation,
  isModalOpen,
  setIsModalOpen,
}) => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [situationItemName, setSituationItemName] = useState(null);
  const [situationItemDesc, setSituationItemDesc] = useState(null);
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
      setFilteredDecoders(decoders);
      setEncoders(encoders);
      setFilteredEncoders(encoders);
    })();
  }, [isModalOpen]);

  const [selectedEncoder, setSelectedEncoder] = useState(null);
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
      encoders?.forEach((encoder) => {
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
      decoders?.forEach((decoder) => {
        if (decoder.nickName.includes(decoderFilter))
          tempFilteredDecoders.push(decoder);
      });
    }
    setFilteredDecoders(tempFilteredDecoders);
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

  const handleReset = () => {
    setSituationItemName(null);
    setSituationItemDesc(null);
    setDecoders([]);
    setEncoders([]);
    setSelectedEncoder(null);
    setEncoderFilter("");
    setFilteredEncoders([]);
    setSelectedDecoders([]);
    setDecoderFilter("");
    setFilteredDecoders([]);
  };

  const handleCreateItem = async () => {
    if (selectedEncoder && selectedDecoders?.length !== 0) {
      await presetDeviceLink({
        store: store,
        presetDetailId: `${situation.id}-${uuid()}`,
        linkType: "usb",
        value1: "",
        encoder: selectedEncoder,
        remark: situationItemDesc,
        deviceLinkDetails: selectedDecoders,
        presetPostDetail: {
          preSetId: situationItemName,
          orderNum: 1,
          remark: situationItemDesc,
        },
      });
      handleReset();
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <Modal
        title={
          <span className="usb-modal-title">
            <FormattedMessage {...Messages.Text_Situation_AddSituationItem} />
            {" - "}
            <FormattedMessage {...Messages.Text_Situation_USBConnection} />
          </span>
        }
        className="usb-modal usb-content modal-title"
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          handleReset();
          setIsModalOpen(false);
        }}
      >
        <div className="situation-usb-layout-column">
          <div className="situation-usb-option-container">
            <div className="situation-usb-option-row">
              <div className="situation-usb-input-layout-column">
                <div>
                  <div className="situation-usb-input-text">
                    <FormattedMessage {...Messages.Text_Common_Name} />
                  </div>
                  <div>
                    <Input
                      className="situation-usb-input situation-usb-input-placeholder"
                      value={situationItemName}
                      placeholder={intl.formatMessage(
                        Messages.Text_Common_InputName
                      )}
                      onChange={(e) => {
                        setSituationItemName(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: 24 }}>
                  <div className="situation-usb-input-text">
                    <FormattedMessage {...Messages.Text_Common_Description} />
                  </div>
                  <div>
                    <Input
                      className="situation-usb-input situation-usb-input-placeholder"
                      value={situationItemDesc}
                      placeholder={intl.formatMessage(
                        Messages.Text_Situation_InputDescription
                      )}
                      onChange={(e) => {
                        setSituationItemDesc(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <Divider className="divider" />
              </div>
            </div>
            <div className="usb-container">
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
                    value={encoderFilter}
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
                <div id="decoder-selection" style={{ marginLeft: 46 }}>
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
                    <FormattedMessage
                      {...Messages.Text_USB_ChooseDestination}
                    />{" "}
                    (
                    <FormattedMessage {...Messages.Text_Common_Decoder} />)
                  </div>
                  <Input
                    className="usb-add-input usb-input usb-add-input-placeholder"
                    variant="filled"
                    value={decoderFilter}
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
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="add-situation-item-btn-row">
          <Button
            className="item-cancel-btn"
            style={{ marginRight: 16 }}
            onClick={() => {
              handleReset();
              setIsModalOpen(false);
            }}
          >
            <span className="item-cancel-btn-text">
              <FormattedMessage {...Messages.Text_Button_Cancel} />
            </span>
          </Button>
          <Button
            className="item-submit-btn"
            onClick={() => {
              handleCreateItem();
            }}
          >
            <span className="item-submit-btn-text">
              <FormattedMessage {...Messages.Text_Button_Add} />
            </span>
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default USBModal;
