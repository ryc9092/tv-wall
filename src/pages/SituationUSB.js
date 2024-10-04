import React, { useContext, useEffect, useRef, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Col, Divider, Input, Radio, Row, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import useWindowDimensions from "../utils/WindowDimension";
import { ENCODER_TYPERS } from "../utils/Constant";
import { presetDeviceLink, getDecoders, getEncoders } from "../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
} from "../utils/Utils";
import "../App.scss";
import "./USB.scss";

const SituationUSB = ({
  situationId,
  openParentModal,
  setReloadPresetDetails,
  detailsNum,
  reload,
  description,
  setDescription,
}) => {
  const intl = useIntl();
  const { width, height } = useWindowDimensions();
  const [store] = useContext(StoreContext);
  const [encoderType, setEncoderType] = useState("1");
  const [decoderDict, setDecoderDict] = useState({}); // { $mac: { nickName: $nickName, mac: $mac... } }
  const [encoderDict, setEncoderDict] = useState({});
  const [searchFilter, setSearchFilter] = useState("");
  const [decoderElements, setDecoderElements] = useState([]);
  const [encoderElements, setEncoderElements] = useState([]);
  const [choosedDecoderList, setChoosedDecoderList] = useState([]);
  const [choosedDecoderElements, setChoosedDecoderElements] = useState(null);
  const [choosedEncoder, setChoosedEncoder] = useState(null);

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

  const clear = () => {
    setDescription(null);
    setChoosedEncoder([]);
    setChoosedDecoderList([]);
  };

  // clear selected items
  useEffect(() => {
    clear();
  }, [reload]);

  // set devices dict state
  useEffect(() => {
    (async () => {
      const decoders = await getDecoders(store);
      setDeviceState(decoders, setDecoderDict);
      const encoders = await getEncoders(store);
      setDeviceState(encoders, setEncoderDict);
    })();
  }, [store]);

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
  }, [choosedDecoderList, decoderDict]);

  const handleCancel = () => {
    setChoosedDecoderList([]);
    setChoosedEncoder();
  };

  const handleCreateConnection = async () => {
    if (choosedDecoderList.length > 0 && choosedEncoder) {
      const result = await presetDeviceLink({
        store: store,
        presetDetailId: `preset.usb.${situationId}.${choosedEncoder}`,
        linkType: "usb",
        encoder: choosedEncoder,
        decoders: choosedDecoderList,
        remark: description,
        presetPostDetail: {
          preSetId: situationId,
          orderNum: detailsNum + 1,
          remark: description,
        },
      });
      if (result) {
        clear();
        openParentModal(false);
        setReloadPresetDetails(Math.random());
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

  return (
    <div
      className="usb-layout container-width"
      style={{ margin: "16px 16px 0px 0px" }}
    >
      <div
        style={{ height: height < "750" ? "50%" : "55%", minHeight: "250px" }}
      >
        <Row style={{ height: "13%" }}>
          <Col>
            <Typography.Text style={{ fontSize: "20px", marginRight: "10px" }}>
              <FormattedMessage {...Messages.Text_USB_Source} />
            </Typography.Text>
          </Col>
          <Col>
            <Input
              onChange={(e) => {
                setSearchFilter(e.target.value);
              }}
              prefix={<SearchOutlined />}
            />
          </Col>
        </Row>
        <Row style={{ height: "14%" }}>
          <Radio.Group
            options={ENCODER_TYPERS}
            onChange={changeEncoderType}
            value={encoderType}
            optionType="button"
            buttonStyle="solid"
            style={{ marginTop: 12 }}
          />
        </Row>
        <div className="decoder-block">{encoderElements}</div>
      </div>
      <div
        className="usb-col-layout"
        style={{
          border: "1px solid gray",
          height: "45%",
          minHeight: "220px",
          marginTop: "12px",
        }}
      >
        <div
          style={{
            borderRight: "1px solid gray",
            height: height * 0.39,
          }}
        >
          <Row>
            <FormattedMessage {...Messages.Text_USB_ConnectionStatus} />
          </Row>
          <Row style={{ marginTop: 24, marginLeft: 6 }}>
            <Col span={8}>
              <Row>
                <FormattedMessage {...Messages.Text_Common_Encoder} />
              </Row>
              <Row style={{ marginTop: 6 }}>
                {encoderDict[choosedEncoder]?.nickName}
              </Row>
            </Col>
            <Col span={8}>
              <Row style={{ marginLeft: 14 }}>
                <FormattedMessage {...Messages.Text_USB_Connect} />
              </Row>
              <Row>{"<------------>"}</Row>
            </Col>
            <Col span={8}>
              <Row>
                <FormattedMessage {...Messages.Text_Common_Decoder} />
              </Row>
              {choosedDecoderElements}
            </Col>
          </Row>
        </div>
        <div>
          <Row>
            <Col span={width > 1060 ? 19 : 16}>
              <FormattedMessage {...Messages.Text_USB_TerminalChoose} />
            </Col>
          </Row>
          <Row>
            <div className="encoder-block" style={{ height: height * 0.26 }}>
              {decoderElements}
            </div>
          </Row>
          <Divider
            style={{
              marginTop: -12,
              marginBottom: 10,
            }}
          />
          <Row>
            <Col offset={2}>
              <Button onClick={handleCancel}>
                <FormattedMessage {...Messages.Text_Button_Cancel} />
              </Button>
            </Col>
            <Col offset={14}>
              <Button onClick={handleCreateConnection}>
                <FormattedMessage {...Messages.Text_Button_Save} />
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default SituationUSB;
