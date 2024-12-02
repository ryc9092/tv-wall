import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../components/store/store";
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  Modal,
  Row,
  Table,
  Tag,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  getFilteredDecoders,
  presetDeviceLink,
} from "../../api/API";
import { uuid } from "../../utils/Utils";
import { showWarningNotification } from "../../utils/Utils";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../messages";
import "./addSituationContent.scss";
// import "./tvWallModal.scss";
import "./singlescreenModal.scss";
import "../../pages/SingleScreen.scss";

const SingleScreenModal = ({
  situation,
  situationItemLength,
  isModalOpen,
  setIsModalOpen,
  setReload,
  encoders,
  setEncoders,
}) => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [situationItemDesc, setSituationItemDesc] = useState(null);
  const [selectedEncoder, setSelectedEncoder] = useState({
    mac: "",
    previewUrl: "",
    nickName: "",
  });
  const [decoders, setDecoders] = useState([]);
  const [searchDecoderFilter, setSearchDecoderFilter] = useState("");
  const [filteredDecoders, setFilteredDecoders] = useState([]);
  const [decoderCards, setDecoderCards] = useState(null);
  const [searchEncoderFilter, setSearchEncoderFilter] = useState("");
  const [filteredEncoders, setFilteredEncoders] = useState([]);
  const [updateDecoderCards, setUpdateDecoderCards] = useState(null);
  const [currentScreen, setCurrentScreen] = useState(null);

  const handleScreenMouseEnter = (event) => {
    const itemId = event.target.id;
    setCurrentScreen(itemId);
  };

  const handleScreenMouseLeave = () => {
    setCurrentScreen(null);
  };

  // set encoder, decoder
  useEffect(() => {
    (async () => {
      const decoders = await getFilteredDecoders(store);
      // const decoders = [{mac: "ffff", nickName: "test", state: "Up"}]
      let tempDecoders = []; // for set decoders
      decoders?.forEach((decoder) => {
        tempDecoders.push({
          ...decoder,
          previewUrl: "",
          encoder: {
            mac: "",
            nickName: "",
          },
        });
      });
      setDecoders(tempDecoders.length > 0 ? tempDecoders : decoders);
    })();
  }, [isModalOpen]);

  // filtered encoder list
  useEffect(() => {
    (async () => {
      let tempFilteredEncoders = [];
      encoders?.forEach((encoder) => {
        if (encoder.nickName.includes(searchEncoderFilter))
          tempFilteredEncoders.push({ key: encoder.mac, ...encoder });
      });
      setFilteredEncoders(tempFilteredEncoders);
    })();
  }, [encoders, searchEncoderFilter]);

  const modifyVideoSize = (previewUrl, width, height) => {
    const hostname = previewUrl.split("?")[0];
    const modifiedUrl = `${hostname}?action=stream&w=${width}&h=${height}&fps=15&bw=5000&as=0`;
    return modifiedUrl;
  };

  const onScreenClick = (event, encoder) => {
    if (!event.target.id.includes("btn") && encoder.previewUrl) {
      let tempDecoders = [];
      const decoderMac = event.target.id.split("@")[1];
      decoders?.forEach((decoder) => {
        if (decoder.mac === decoderMac) {
          tempDecoders.push({
            ...decoder,
            previewUrl: encoder.previewUrl,
            encoder: {
              mac: encoder.mac,
              nickName: encoder.nickName,
            },
          });
        } else {
          tempDecoders.push(decoder);
        }
      });
      setDecoders(tempDecoders);
      setUpdateDecoderCards(Math.random());
    }
  };

  // filtered decoder list
  useEffect(() => {
    (async () => {
      let tempFilteredDecoders = [];
      decoders?.forEach((decoder) => {
        if (decoder.nickName.includes(searchDecoderFilter))
          tempFilteredDecoders.push(decoder);
      });
      setFilteredDecoders(tempFilteredDecoders);
    })();
  }, [decoders, searchDecoderFilter]);

  useEffect(() => {
    let tempDecoderCards = [];
    filteredDecoders?.forEach((decoder) => {
      tempDecoderCards.push(
        <Col key={`col@${decoder.mac}`} id={`card@${decoder.mac}`} onMouseOver={handleScreenMouseEnter} onMouseLeave={handleScreenMouseLeave}>
          <div
            className="situation-single-screen-card"
            onClick={(event) => onScreenClick(event, selectedEncoder)}
          >
            {decoder.previewUrl ? (
              <iframe
                className="situation-single-screen-card-video"
                src={modifyVideoSize(decoder.previewUrl, 350, 232)}
                title="Video player"
              />
            ) : null}
            <div
              id={`card@${decoder.mac}`}
              className="situation-single-screen-card-top"
              style={{
                backgroundColor:
                  currentScreen && currentScreen.includes(decoder.mac)
                    ? "gray"
                    : null,
              }}
            >
              <div
                id={`card@${decoder.mac}`}
                className="situation-single-screen-card-title-row"
              >
                <span
                  id={`card@${decoder.mac}`}
                  className="situation-single-screen-card-title"
                  style={{
                    color:
                      currentScreen && currentScreen.includes(decoder.mac)
                        ? "white"
                        : "#45413e",
                  }}
                >
                  {decoder.nickName}
                </span>
                <span id={`card@${decoder.mac}`} style={{ marginTop: "2px" }}>
                  {decoder.state === "Up" ? (
                    <Tag
                      id={`card@${decoder.mac}`}
                      color={"#eef9b4"}
                      key={`${decoder.name}.${decoder.state}`}
                    >
                      <span
                        id={`card@${decoder.mac}`}
                        style={{ color: "#a0b628" }}
                        className="tag-content"
                      >
                        <FormattedMessage {...Messages.Text_Common_Up} />
                      </span>
                    </Tag>
                  ) : decoder.state === "Down" ? (
                    <Tag
                      id={`card@${decoder.mac}`}
                      color={"#ffe6e5"}
                      key={`${decoder.name}.${decoder.state}`}
                    >
                      <span
                        id={`card@${decoder.mac}`}
                        style={{ color: "#d55959" }}
                        className="tag-content"
                      >
                        <FormattedMessage {...Messages.Text_Common_Down} />
                      </span>
                    </Tag>
                  ) : (
                    <Tag
                      id={`card@${decoder.mac}`}
                      color={"yellow"}
                      key={`${decoder.name}.${decoder.state}`}
                    >
                      <span
                        id={`card@${decoder.mac}`}
                        style={{ color: "#d55959" }}
                        className="tag-content"
                      >
                        {decoder.state}
                      </span>
                    </Tag>
                  )}
                </span>
              </div>
              {currentScreen && currentScreen.includes(decoder.mac) ? (
                <div id={`card@${decoder.mac}`}>
                  <div
                    id={`card@${decoder.mac}`}
                    className="single-screen-card-desc"
                    // style={{zIndex: 100, backgroundColor: "black", color: "white"}}
                  >
                    <FormattedMessage {...Messages.Text_TVWall_VideoSource} />
                    {" : "}{" "}
                    {decoder.previewUrl
                      ? decoder.encoder?.nickName
                      : intl.formatMessage(Messages.Text_Common_None)}
                  </div>
                  <div
                    id={`card@${decoder.mac}`}
                    className={
                      store.siderCollapse
                        ? "single-screen-btn-position-collapse"
                        : "single-screen-btn-position"
                    }
                  >
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </Col>
      );
    });
    setDecoderCards(tempDecoderCards);
  }, [filteredDecoders, updateDecoderCards, selectedEncoder, currentScreen]);

  const columns = [
    {
      title: intl.formatMessage(Messages.Text_Common_Name),
      dataIndex: "nickName",
      key: "nickName",
      render: (text) => {
        return (
          <span
            className="table-content"
            style={
              selectedEncoder.nickName === text
                ? { backgroundColor: "#FDEBD0" }
                : null
            }
          >
            {text}
          </span>
        );
      },
    },
    {
      title: intl.formatMessage(Messages.Text_Common_Model),
      dataIndex: "model",
      key: "model",
      filters: [
        {
          text: "ZyperUHD60",
          value: "ZyperUHD60",
        },
        {
          text: "Zyper4k",
          value: "Zyper4k",
        },
      ],
      onFilter: (value, data) => data.model.indexOf(value) === 0,
      render: (text) => {
        return <span className="table-content">{text}</span>;
      },
    },
    {
      title: intl.formatMessage(Messages.Text_Common_State),
      width: "25%",
      key: "state",
      dataIndex: "state",
      sorter: (a, b) => a.state.length - b.state.length,
      render: (_, { state, name }) => (
        <>
          {state === "Up" ? (
            <Tag color={"#eef9b4"} key={`${name}.${state}`}>
              <span style={{ color: "#a0b628" }} className="tag-content">
                <FormattedMessage {...Messages.Text_Common_Up} />
              </span>
            </Tag>
          ) : state === "Down" ? (
            <Tag color={"#ffe6e5"} key={`${name}.${state}`}>
              <span style={{ color: "#d55959" }} className="tag-content">
                <FormattedMessage {...Messages.Text_Common_Down} />
              </span>
            </Tag>
          ) : (
            <Tag color={"yellow"} key={`${name}.${state}`}>
              <span className="tag-content">{state}</span>
            </Tag>
          )}
        </>
      ),
    },
  ];

  const handleChooseEncoder = (encoder) => {
    if (encoder.mac !== selectedEncoder.mac)
      setSelectedEncoder({
        mac: encoder.mac,
        previewUrl: encoder.previewUrl,
        nickName: encoder.nickName,
      });
  };

  const handleReset = () => {
    setSituationItemDesc(null);
    setSelectedEncoder({
      mac: "",
      previewUrl: "",
      nickName: "",
    });
    setFilteredEncoders([]);
    setEncoders([]);
    setDecoders([]);
  };

  const handleCreateItem = async (decoders, encoder) => {
    if (decoders?.length !== 0 && encoder.mac && situationItemDesc) {
      let linkDecoders = [];
      decoders?.forEach((decoder) => {
        if (decoder.encoder.mac === encoder.mac) linkDecoders.push(decoder.mac);
      });
      await presetDeviceLink({
        store: store,
        presetDetailId: `video@${uuid()}`,
        linkType: "video",
        value1: "",
        encoder: encoder.mac,
        remark: situationItemDesc,
        deviceLinkDetails: linkDecoders,
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
          <span className="single-screen-modal-title">
            <FormattedMessage {...Messages.Text_Situation_AddSituationItem} />
            {" - "}
            <FormattedMessage
              {...Messages.Text_Situation_SingleScreenConnection}
            />
          </span>
        }
        className="single-screen-modal single-screen-content-modal-close-icon single-screen-content modal-title"
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          handleReset();
          setIsModalOpen(false);
        }}
      >
        <div className="situation-single-screen-layout-column">
          <div className="situation-single-screen-option-container">
            <div className="situation-single-screen-option-row">
              <div className="situation-single-screen-input-layout-column">
                <div>
                  <div className="situation-single-screen-input-text">
                    <FormattedMessage {...Messages.Text_Common_Description} />
                  </div>
                  <div>
                    <Input
                      className="situation-single-screen-input situation-single-screen-input-placeholder"
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
                <Divider className="single-screen-modal-divider" />
              </div>
            </div>
            <div className="single-screen-modal-connection-title">
              <FormattedMessage
                {...Messages.Text_Situation_SingleScreenConnection}
              />
            </div>
            <Input
              className="single-screen-search-input singlescreen-input"
              variant="filled"
              onChange={(e) => {
                setSearchDecoderFilter(e.target.value);
              }}
              prefix={<SearchOutlined />}
              placeholder={intl.formatMessage(
                Messages.Text_SingleScreen_InputDecoder
              )}
            />
            <div className="single-screen-modal-container">
              <Row gutter={15}>{decoderCards}</Row>
            </div>
          </div>
          <div
            className={
              store.siderCollapse
                ? "single-screen-right-card-container-collapse"
                : "single-screen-right-card-container"
            }
          >
            <Card className="singlescreen-card-right">
              <div className="singlescreen-card-right-title">
                <FormattedMessage {...Messages.Text_TVWall_VideoSource} />
              </div>
              <div className="singlescreen-card-right-desc">
                <FormattedMessage {...Messages.Text_TVWall_VideoSourceDesc} />
              </div>
              {/* <div className="singlescreen-card-right-preview">
                {selectedEncoder.previewUrl ? (
                  <div>
                    <iframe
                      className="singlescreen-card-right-preview-video"
                      src={selectedEncoder.previewUrl}
                      title="Video player"
                    />
                    <span>{selectedEncoder.nickName}</span>
                  </div>
                ) : (
                  <div className="singlescreen-card-right-preview-text singlescreen-card-right-desc">
                    <FormattedMessage {...Messages.Text_TVWall_Preview} />
                  </div>
                )}
              </div> */}
              <Input
                className="singlescreen-card-right-search singlescreen-input"
                variant="filled"
                onChange={(e) => {
                  setSearchEncoderFilter(e.target.value);
                }}
                prefix={<SearchOutlined />}
                placeholder={intl.formatMessage(
                  Messages.Text_TVWall_InputEncoder
                )}
              />
              <div className="singlescreen-modal-card-right-encoder-container">
                <Table
                  className="singlescreen-modal-card-right-encoder-table"
                  columns={columns}
                  dataSource={filteredEncoders}
                  pagination={{ pageSize: 11 }}
                  onRow={(record) => ({
                    onClick: () => {
                      handleChooseEncoder(record);
                    },
                  })}
                />
              </div>
            </Card>
          </div>
        </div>
        <div className="situation-single-screen-item-btn-row">
          <Button
            className="situation-single-screen-item-cancel-btn"
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
              handleCreateItem(decoders, selectedEncoder);
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

export default SingleScreenModal;
