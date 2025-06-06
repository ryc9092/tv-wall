import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../store/store";
import { Button, Divider, Input, Modal, Table, Tag } from "antd";
import { getPresetDeviceLink } from "../../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../messages";
import SearchIcon from "../../assets/magnifying-glass.png";
import "../situation/addSituationContent.scss";
import "../situation/usbModal.scss";
import "./usbViewModal.scss";

import useWindowDimensions from "../../utils/WindowDimension";

const USBViewModal = ({
  situationDetailId,
  isModalOpen,
  setIsModalOpen,
  encoders,
  decoders,
  type,
}) => {
  const intl = useIntl();
  const { height } = useWindowDimensions();
  const [store] = useContext(StoreContext);
  const [situationItemDesc, setSituationItemDesc] = useState(null);

  useEffect(() => {
    if (isModalOpen === true) {
      (async () => {
        let linkedEncoder;
        let linkedDecoders = [];
        const deviceLinks = await getPresetDeviceLink(store, type);
        deviceLinks.forEach((link) => {
          if (link.id === situationDetailId) {
            setSituationItemDesc(link.remark);
            linkedEncoder = link.encoder;
            link.deviceLinkDetails?.forEach((decoderLink) => {
              linkedDecoders.push(decoderLink.decoder);
            });
          }
        });
        setSelectedEncoder(linkedEncoder);
        setSelectedDecoders(linkedDecoders);
      })();
    }
  }, [isModalOpen]);

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
    getCheckboxProps: (record) => {
      return { disabled: true };
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
    getCheckboxProps: (record) => {
      return { disabled: true };
    },
  };

  return (
    <div>
      {isModalOpen && (
        <Modal
          title={
            <span className="usb-modal-title">
              <FormattedMessage
                {...Messages.Text_Situation_ViewSituationItem}
              />
              {" - "}
              <FormattedMessage {...Messages.Text_Situation_USBConnection} />
            </span>
          }
          className="usb-view-modal usb-content-modal-close-icon usb-content modal-title"
          open={isModalOpen}
          footer={null}
          onCancel={() => {
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
                        className="situation-usb-input situation-usb-input-text"
                        value={situationItemDesc}
                        disabled
                      />
                    </div>
                  </div>
                  <Divider className="usb-modal-divider" />
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
                    <div className="usb-view-connect-selection-column">
                      <div className="situation-usb-add-subtitle">
                        <FormattedMessage {...Messages.Text_USB_ChooseSource} />{" "}
                        (
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
                          columnWidth: 50,
                          type: "radio",
                          ...encoderSelection,
                        }}
                        size="small"
                        pagination={false}
                        scroll={{ x: "max-content", y: height - 520 }}
                      />
                    </div>
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
                    <div className="usb-view-connect-selection-column">
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
                          columnWidth: 50,
                          type: "radio",
                          ...decoderSelection,
                        }}
                        size="small"
                        pagination={false}
                        scroll={{ x: "max-content", y: height - 520 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="situation-usb-item-btn-row">
            <Button
              className="situation-usb-item-cancel-btn"
              style={{ marginLeft: 748 }}
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              <span className="item-cancel-btn-text">
                <FormattedMessage {...Messages.Text_Button_Close} />
              </span>
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default USBViewModal;
