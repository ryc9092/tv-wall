import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Input, Modal, Radio, Space, Table, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  getDeviceLinks,
  createDeviceLink,
  removeDeviceLink,
  getDecoders,
  getEncoders,
} from "../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import PlusIcon from "../assets/plus.png";
import CaretLeftIcon from "../assets/caret-left.png";
import PencilIcon from "../assets/pencil.png";
import TrashIcon from "../assets/trash.png";
import SearchIcon from "../assets/magnifying-glass.png";
import "../App.scss";
import "./Audio.scss";

const Audio = () => {
  const intl = useIntl();
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
      const encoders = await getEncoders(store);
      const decoders = await getDecoders(store);
      const deviceLinks = await getDeviceLinks({
        store: store,
        linkType: "audio",
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
  }, [reload]);

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
              inputOutput: link.value1,
            });
            return true;
          } else return false;
        });
      });
      if (index + 1 === deviceLinks.length) setLinkData(tempLinkData);
    });
  }, [deviceLinks, searchFilter]);

  const handleRemoveLink = async (encoderMac, decoderMac, inputOutput) => {
    await removeDeviceLink({
      store: store,
      linkType: `audio`,
      encoder: encoderMac,
      decoders: [decoderMac],
    });
    setReload(Math.random());
  };

  const columns = [
    {
      title: (
        <span className="audio-content-table-head">
          {intl.formatMessage(Messages.Text_Common_Encoder)}
        </span>
      ),
      dataIndex: "encoderName",
      key: "encoderName",
      render: (text) => {
        return <span className="table-content">{text}</span>;
      },
    },
    {
      title: (
        <span className="audio-content-table-head">
          {intl.formatMessage(Messages.Text_Common_Decoder)}
        </span>
      ),
      dataIndex: "decoderName",
      key: "decoderName",
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
            onClick={() => {
              setPageType("EDIT_LINK");
              setSelectedInOutputOption(record.inputOutput);
              setSelectedEncoder(record.encoderMac);
              let linkedDecoders = [];
              linkData?.forEach((link) => {
                if (link.encoderMac === record.encoderMac)
                  linkedDecoders.push(link.decoderMac);
              });
              setSelectedDecoders(linkedDecoders);
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
            key={`remove.${record.decoderMac}`}
            onClick={() => {
              setSelectEncoder(record.encoderMac);
              setSelectDecoder(record.decoderMac);
              setOpenConfirmModal(true);
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

  const [selectedEncoder, setSelectedEncoder] = useState([]);
  const [encoderFilter, setEncoderFilter] = useState("");
  const [filteredEncoders, setFilteredEncoders] = useState([]);

  const encoderSelectionColumns = [
    {
      title: (
        <span className="audio-content-table-head">
          {intl.formatMessage(Messages.Text_Audio_SourceName)}
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
        <span className="audio-content-table-head">
          {intl.formatMessage(Messages.Text_Audio_State)}
        </span>
      ),
      width: "33%",
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

  const [selectedInOutputOption, setSelectedInOutputOption] = useState(null); //////////
  const handleSelectInOutputOption = (option) => {
    setSelectedInOutputOption(option);
  };

  const [selectedDecoders, setSelectedDecoders] = useState([]);
  const [decoderFilter, setDecoderFilter] = useState("");
  const [filteredDecoders, setFilteredDecoders] = useState([]);

  const decoderSelectionColumns = [
    {
      title: (
        <span className="audio-content-table-head">
          {intl.formatMessage(Messages.Text_Audio_DestinationName)}
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
        <span className="audio-content-table-head">
          {intl.formatMessage(Messages.Text_Audio_State)}
        </span>
      ),
      width: "33%",
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
    setFilteredEncoders(tempFilteredDecoders);
  }, [decoderFilter]);

  const decoderSelection = {
    selectedRowKeys: selectedDecoders,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedDecoders(selectedRowKeys);
    },
    getCheckboxProps: (record) => {
      // const hasSelectedEncoder = selectedEncoder !== null;
      // return { disabled: !hasSelectedEncoder };
      const hasSelectedInputOutputOption = selectedInOutputOption !== null;
      return { disabled: !hasSelectedInputOutputOption };
    },
  };

  const handleAddDeviceLink = async () => {
    await createDeviceLink({
      store: store,
      id: `audio.${selectedEncoder}`,
      linkType: "audio",
      encoder: selectedEncoder,
      decoders: selectedDecoders,
      value1: selectedInOutputOption,
      remark: "",
      isPreset: "N",
    });
    setReload(Math.random());
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

    await removeDeviceLink({
      store: store,
      linkType: `audio`,
      encoder: selectedEncoder,
      decoders: linkedDecoders,
    });

    await createDeviceLink({
      store: store,
      id: `audio.${selectedEncoder}`,
      linkType: "audio",
      encoder: selectedEncoder,
      decoders: selectedDecoders,
      value1: selectedInOutputOption,
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
        <div className="audio-title-row">
          <span className="page-title">
            <FormattedMessage {...Messages.Text_Audio_AudioMgmt} />
          </span>
          {pageType === "CONN_STATE" ? (
            <Input
              className="audio-title-input audio-input"
              variant="filled"
              onChange={(e) => {
                setSearchFilter(e.target.value);
              }}
              prefix={<SearchOutlined />}
              placeholder={intl.formatMessage(
                Messages.Text_Audio_InputAudioMsg
              )}
            />
          ) : null}
        </div>
        {pageType === "CONN_STATE" ? (
          <div className="audio-content-container">
            <div className="audio-content-title-row">
              <span className="audio-content-title">
                <FormattedMessage {...Messages.Text_Audio_ConnectionStatus} />
              </span>
              <Button
                shape="circle"
                className="audio-content-create-button"
                onClick={() => {
                  setPageType("ADD_LINK");
                  setSelectedInOutputOption(null);
                  setSelectedEncoder(null);
                  setSelectedDecoders([]);
                  setReload(Math.random());
                }}
              >
                <img
                  alt="create"
                  src={PlusIcon}
                  className="audio-content-create-button-icon"
                />
              </Button>
            </div>
            <Table columns={columns} dataSource={linkData} />
            <Modal
              className="audio-modal-close-x"
              title={
                <span style={{ marginRight: 12 }}>
                  <FormattedMessage
                    {...Messages.Text_Audio_RemoveConnectionConfirm}
                  />
                </span>
              }
              width={400}
              okText={intl.formatMessage(Messages.Text_Common_Confirm)}
              cancelText={intl.formatMessage(Messages.Text_Button_Cancel)}
              open={openConfirmModal}
              onCancel={() => {
                setOpenConfirmModal(false);
              }}
              onOk={() => {
                handleRemoveLink(selectEncoder, selectDecoder);
              }}
            >
              <br />
            </Modal>
          </div>
        ) : (
          <div className="audio-content-container">
            <div className="audio-add-title-row">
              <Button
                shape="circle"
                className="audio-add-link-button"
                onClick={() => setPageType("CONN_STATE")}
              >
                <img
                  alt="return"
                  src={CaretLeftIcon}
                  className="audio-add-link-icon"
                />
              </Button>
              <span className="audio-content-title">
                {pageType === "ADD_LINK" ? (
                  <FormattedMessage {...Messages.Text_Audio_AddConnection} />
                ) : (
                  <FormattedMessage {...Messages.Text_Audio_EditConnection} />
                )}
              </span>
            </div>
            <div className="audio-add-row">
              <div id="encoder-selection" className="audio-add-row-step">
                <div className="audio-add-progress">
                  <div className="audio-add-progress-circle">
                    <span className="audio-add-progress-circle-text">1</span>
                  </div>
                  <div
                    className={
                      selectedEncoder
                        ? "audio-add-progress-bar-finished"
                        : "audio-add-progress-bar"
                    }
                  ></div>
                </div>
                <div className="audio-add-subtitle">
                  <FormattedMessage {...Messages.Text_Audio_ChooseSource} /> (
                  <FormattedMessage {...Messages.Text_Common_Encoder} />)
                </div>
                <Input
                  className="audio-add-input audio-input audio-add-input-placeholder"
                  variant="filled"
                  onChange={(e) => {
                    setEncoderFilter(e.target.value);
                  }}
                  prefix={
                    <img
                      alt="search"
                      src={SearchIcon}
                      className="audio-add-input-prefix"
                    />
                  }
                  placeholder={intl.formatMessage(
                    Messages.Text_Audio_InputEncoder
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
                  className="audio-add-table"
                />
              </div>
              <div style={{ width: "60px" }}></div>
              <div id="input-output-selection" className="audio-add-row-step">
                <div className="audio-add-progress">
                  <div
                    className={
                      selectedEncoder
                        ? "audio-add-progress-circle"
                        : "audio-add-progress-circle-unstarted"
                    }
                  >
                    <span className="audio-add-progress-circle-text">2</span>
                  </div>
                  <div
                    className={
                      selectedInOutputOption
                        ? "audio-add-progress-bar-finished"
                        : "audio-add-progress-bar"
                    }
                  />
                </div>
                <div className="audio-add-subtitle">
                  <FormattedMessage
                    {...Messages.Text_Audio_ChooseInputOutput}
                  />
                </div>
                <Radio.Group
                  onChange={(event) => {
                    handleSelectInOutputOption(event.target.value);
                  }}
                  value={selectedInOutputOption}
                  className="audio-add-radio-group"
                  disabled={selectedEncoder === null}
                >
                  <Space direction="vertical">
                    <Radio value={"analogAudio"} className="audio-add-radio">
                      <span className="audio-add-radio-text">Analog</span>
                    </Radio>
                    <Radio value={"hdmiAudio"} className="audio-add-radio">
                      <span className="audio-add-radio-text">HDMI</span>
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>
              <div style={{ width: "60px" }}></div>
              <div id="decoder-selection" className="audio-add-row-step">
                <div className="audio-add-progress">
                  <div
                    className={
                      selectedInOutputOption
                        ? "audio-add-progress-circle"
                        : "audio-add-progress-circle-unstarted"
                    }
                  >
                    <span className="audio-add-progress-circle-text">3</span>
                  </div>
                  <div
                    className={
                      selectedDecoders.length !== 0
                        ? "audio-add-progress-bar-finished"
                        : "audio-add-progress-bar"
                    }
                  />
                </div>
                <div className="audio-add-subtitle">
                  <FormattedMessage
                    {...Messages.Text_Audio_ChooseDestination}
                  />{" "}
                  (
                  <FormattedMessage {...Messages.Text_Common_Decoder} />)
                </div>
                <Input
                  className="audio-add-input audio-input audio-add-input-placeholder"
                  variant="filled"
                  onChange={(e) => {
                    setDecoderFilter(e.target.value);
                  }}
                  prefix={
                    <img
                      alt="search"
                      src={SearchIcon}
                      className="audio-add-input-prefix"
                    />
                  }
                  placeholder={intl.formatMessage(
                    Messages.Text_Audio_InputDecoder
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
                  className="audio-add-table"
                />
                <Button
                  className="audio-add-btn"
                  disabled={
                    !selectedEncoder ||
                    !selectedInOutputOption ||
                    selectedDecoders.length === 0
                  }
                  onClick={
                    pageType === "ADD_LINK"
                      ? handleAddDeviceLink
                      : handleEditDeviceLink
                  }
                >
                  <span className="audio-add-btn-text">
                    {pageType === "ADD_LINK" ? (
                      <FormattedMessage
                        className="audio-add-btn-text"
                        {...Messages.Text_Button_Add}
                      />
                    ) : (
                      <FormattedMessage
                        className="audio-add-btn-text"
                        {...Messages.Text_Common_Confirm}
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

export default Audio;
