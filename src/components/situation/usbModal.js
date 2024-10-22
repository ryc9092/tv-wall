import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../components/store/store";
import { Button, Divider, Input, Modal, Table, Tag } from "antd";
import { presetDeviceLink } from "../../api/API";
import { uuid } from "../../utils/Utils";
import { showWarningNotification } from "../../utils/Utils";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../messages";
import SearchIcon from "../../assets/magnifying-glass.png";
import "./addSituationContent.scss";
import "./usbModal.scss";

const USBModal = ({
  situation,
  situationItemLength,
  isModalOpen,
  setIsModalOpen,
  setReload,
  encoders,
  setEncoders,
  decoders,
  setDecoders
}) => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [situationItemDesc, setSituationItemDesc] = useState(null);

  useEffect(() => {
    (async () => {
      encoders?.forEach((encoder) => {
        encoder.key = encoder.mac;
      });
      decoders?.forEach((decoder) => {
        decoder.key = decoder.mac;
      });
      setFilteredDecoders(decoders);
      setFilteredEncoders(encoders);
    })();
  }, [isModalOpen, encoders, decoders]);

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
    if (encoders?.length !== 0) {
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
    if (decoders?.length !== 0) {
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
    if (selectedEncoder && selectedDecoders?.length !== 0 && situationItemDesc) {
      await presetDeviceLink({
        store: store,
        presetDetailId: `usb@${uuid()}`,
        linkType: "usb",
        value1: "",
        encoder: selectedEncoder,
        remark: situationItemDesc,
        deviceLinkDetails: selectedDecoders,
        presetPostDetail: {
          preSetId: situation.id,
          orderNum: situationItemLength + 1,
          remark: situationItemDesc,
        },
      });
      handleReset();
      setReload(Math.random());
      setIsModalOpen(false);
    } else {
      showWarningNotification(
        intl.formatMessage(Messages.Text_Common_RequiredHint)
      );
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
        className="usb-modal usb-content-modal-close-icon usb-content modal-title"
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
            <div className="situation-usb-container">
              <div className="situation-usb-add-row">
                <div id="encoder-selection">
                  <div className="situation-usb-add-progress">
                    <div className="situation-usb-add-progress-circle">
                      <span className="situation-usb-add-progress-circle-text">
                        1
                      </span>
                    </div>
                    <div
                      className={
                        selectedEncoder
                          ? "situation-usb-add-progress-bar-finished"
                          : "situation-usb-add-progress-bar"
                      }
                    ></div>
                  </div>
                  <div className="situation-usb-add-subtitle">
                    <FormattedMessage {...Messages.Text_USB_ChooseSource} /> (
                    <FormattedMessage {...Messages.Text_Common_Encoder} />)
                  </div>
                  <Input
                    className="situation-usb-add-input situation-usb-input situation-usb-add-input-placeholder"
                    variant="filled"
                    value={encoderFilter}
                    onChange={(e) => {
                      setEncoderFilter(e.target.value);
                    }}
                    prefix={
                      <img
                        alt="search"
                        src={SearchIcon}
                        className="situation-usb-add-input-prefix"
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
                  <div className="situation-usb-add-progress">
                    <div
                      className={
                        selectedEncoder
                          ? "situation-usb-add-progress-circle"
                          : "situation-usb-add-progress-circle-unstarted"
                      }
                    >
                      <span className="situation-usb-add-progress-circle-text">
                        2
                      </span>
                    </div>
                    <div
                      className={
                        selectedDecoders.length !== 0
                          ? "situation-usb-add-progress-bar-finished"
                          : "situation-usb-add-progress-bar"
                      }
                    ></div>
                  </div>
                  <div className="situation-usb-add-subtitle">
                    <FormattedMessage
                      {...Messages.Text_USB_ChooseDestination}
                    />{" "}
                    (
                    <FormattedMessage {...Messages.Text_Common_Decoder} />)
                  </div>
                  <Input
                    className="situation-usb-add-input situation-usb-input situation-usb-add-input-placeholder"
                    variant="filled"
                    value={decoderFilter}
                    onChange={(e) => {
                      setDecoderFilter(e.target.value);
                    }}
                    prefix={
                      <img
                        alt="search"
                        src={SearchIcon}
                        className="situation-usb-add-input-prefix"
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
        <div className="situation-usb-item-btn-row">
          <Button
            className="situation-usb-item-cancel-btn"
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
