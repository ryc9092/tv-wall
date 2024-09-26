import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../components/store/store";
import { Button, Divider, Input, Modal, Radio, Space, Table, Tag } from "antd";
import { getEncoders, getDecoders, presetDeviceLink } from "../../api/API";
import { uuid } from "../../utils/Utils";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../messages";
import SearchIcon from "../../assets/magnifying-glass.png";
import "./addSituationContent.scss";
import "./audioModal.scss";
import "../../pages/Audio.scss";

const AudioModal = ({
  situation,
  situationItemLength,
  isModalOpen,
  setIsModalOpen,
  setReload,
}) => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
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
      // const hasSelectedEncoder = selectedEncoder !== null;
      // return { disabled: !hasSelectedEncoder };
      const hasSelectedInputOutputOption = selectedInOutputOption !== null;
      return { disabled: !hasSelectedInputOutputOption };
    },
  };

  const handleReset = () => {
    setSituationItemDesc(null);
    setDecoders([]);
    setEncoders([]);
    setSelectedEncoder(null);
    setEncoderFilter("");
    setFilteredEncoders([]);
    setSelectedInOutputOption(null);
    setSelectedDecoders([]);
    setDecoderFilter("");
    setFilteredDecoders([]);
  };

  const handleCreateItem = async () => {
    if (selectedEncoder && selectedDecoders?.length !== 0) {
      await presetDeviceLink({
        store: store,
        presetDetailId: `audio@${uuid()}`,
        linkType: "audio",
        value1: selectedInOutputOption,
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
    }
  };

  return (
    <div>
      <Modal
        title={
          <span className="audio-modal-title">
            <FormattedMessage {...Messages.Text_Situation_AddSituationItem} />
            {" - "}
            <FormattedMessage {...Messages.Text_Situation_AudioConnection} />
          </span>
        }
        className="audio-modal audio-content-modal-close-icon audio-content modal-title"
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          handleReset();
          setIsModalOpen(false);
        }}
      >
        <div className="situation-audio-layout-column">
          <div className="situation-audio-option-container">
            <div className="situation-audio-option-row">
              <div className="situation-audio-input-layout-column">
                <div>
                  <div className="situation-audio-input-text">
                    <FormattedMessage {...Messages.Text_Common_Description} />
                  </div>
                  <div>
                    <Input
                      className="situation-audio-input situation-audio-input-placeholder"
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
            <div className="audio-container">
              <div className="audio-add-row">
                <div id="encoder-selection">
                  <div className="audio-add-progress">
                    <div className="audio-progress-circle">
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
                    value={encoderFilter}
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
                    className="situation-audio-table"
                    columns={encoderSelectionColumns}
                    dataSource={filteredEncoders}
                    rowSelection={{
                      type: "radio",
                      ...encoderSelection,
                    }}
                    pagination={false}
                  />
                </div>
                <div id="input-output-selection" className="audio-add-row-step">
                  <div className="audio-add-progress">
                    <div
                      className={
                        selectedEncoder
                          ? "audio-progress-circle"
                          : "audio-progress-circle-unstarted"
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
                <div id="decoder-selection">
                  <div className="audio-add-progress">
                    <div
                      className={
                        selectedInOutputOption
                          ? "audio-progress-circle"
                          : "audio-progress-circle-unstarted"
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
                    ></div>
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
                    value={decoderFilter}
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
                    className="situation-audio-table"
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
        <div className="situation-audio-item-btn-row">
          <Button
            className="situation-audio-item-cancel-btn"
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

export default AudioModal;
