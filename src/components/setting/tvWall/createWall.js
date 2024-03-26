import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../../components/store/store";
import {
  Button,
  Col,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import { getDecoders, createWall } from "../../../api/API";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
} from "../../../utils/Utils";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../../messages";
import "../../../App.scss";

const CreateWall = ({ setReload }) => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wallId, setWallId] = useState(null);
  const [wallName, setWallName] = useState(null);
  const [wallSize, setWallSize] = useState({ col: 1, row: 1 });
  const [screenList, setScreenList] = useState([]);
  const [decoderOptions, setDecoderOptions] = useState([]);
  const [wallObj, setWallObj] = useState(null);

  // get decoders
  useEffect(() => {
    let tempDecoders = [];
    let tempDecoderOptions = [];
    (async () => {
      const decoders = await getDecoders(store);
      if (decoders) tempDecoders = decoders;
      tempDecoders.forEach((decoder) => {
        tempDecoderOptions.push({ value: decoder.mac, label: decoder.name });
      });
      setDecoderOptions(tempDecoderOptions);
    })();
  }, []);

  const resetWall = () => {
    setWallId(null);
    setWallName(null);
    setWallSize({ col: 1, row: 1 });
    setScreenList([]);
  };

  useEffect(() => {
    resetWall();
  }, [isModalOpen]);

  useEffect(() => {
    // generate default screen list: [{number: 1, decoder: ""}, {number: 2, decoder: ""}, ...]
    setScreenList(
      Array.from({ length: wallSize.col * wallSize.row }, (v, i) => {
        return { num: i + 1, decoder: "", block: "" };
      })
    );
  }, [wallSize]);

  useEffect(() => {
    // create wall table
    let tempRow = [];
    let tempWall = [];
    screenList.forEach((screen) => {
      tempRow.push(
        <td
          style={{ width: "40px", height: "40px", textAlign: "center" }}
          key={screen.num}
        >
          {screen.num}
        </td>
      );
      if (tempRow.length === wallSize.col) {
        tempWall.push(<tr key={screen.num}>{tempRow}</tr>);
        tempRow = []; // clear row
      }
    });
    setWallObj(tempWall);
  }, [screenList]);

  const setScreenDecoder = ({ screenNumber, decoder }) => {
    let list = screenList;
    list[screenNumber - 1] = { num: screenNumber, decoder: decoder };
    setScreenList(screenList);
  };

  const saveWall = () => {
    (async () => {
      const result = await createWall(
        store,
        wallId,
        wallName,
        wallSize.col,
        wallSize.row,
        screenList
      );
      if (result) {
        showSuccessNotificationByMsg(
          intl.formatMessage(Messages.Text_WallSetting_CreateSuccess)
        );
        setReload(Math.random);
        setIsModalOpen(false);
      } else
        showWarningNotification(
          intl.formatMessage(Messages.Text_WallSetting_CreateFail)
        );
    })();
  };

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>
        <Typography.Text>
          <FormattedMessage {...Messages.Text_WallSetting_CreateWall} />
        </Typography.Text>
      </Button>
      <Modal
        title={intl.formatMessage(Messages.Text_WallSetting_CreateWall)}
        className="modal-title"
        width={568}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          resetWall();
          setIsModalOpen(false);
        }}
      >
        <Row style={{ marginTop: "20px" }}>
          <Col style={{ marginRight: "16px" }}>
            <FormattedMessage {...Messages.Text_WallSetting_Wall} />
            {" ID:"}
          </Col>
          <Col style={{ marginRight: "16px" }}>
            <Input
              value={wallId}
              size="small"
              style={{ width: "120px" }}
              onChange={(e) => {
                setWallId(e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: "16px" }}>
          <Col style={{ marginRight: "6px" }}>
            <FormattedMessage {...Messages.Text_WallSetting_WallName} />
            {":"}
          </Col>
          <Col style={{ marginRight: "16px" }}>
            <Input
              value={wallName}
              size="small"
              style={{ width: "120px" }}
              onChange={(e) => {
                setWallName(e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: "16px" }}>
          <Col style={{ marginRight: "16px" }}>
            <FormattedMessage {...Messages.Text_Common_Dimension} />
            {":"}
          </Col>
          <Col style={{ marginRight: "6px" }}>
            <InputNumber
              value={wallSize.col}
              min={1}
              max={6}
              size="small"
              style={{ width: "48px" }}
              onChange={(value) => setWallSize({ ...wallSize, col: value })}
            />
          </Col>
          <Col style={{ marginRight: "6px" }}>{" X "}</Col>
          <Col>
            <InputNumber
              value={wallSize.row}
              min={1}
              max={6}
              size="small"
              style={{ width: "48px" }}
              onChange={(value) => setWallSize({ ...wallSize, row: value })}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: "16px" }}>
          <Col style={{ marginRight: "12px" }}>
            <div style={{ marginBottom: "2px" }}>
              <FormattedMessage {...Messages.Text_WallSetting_ScreenNumber} />
            </div>
            <div
              style={{
                width: "279px",
                height: "279px",
                border: "1px solid black",
              }}
            >
              <table>
                <tbody>{wallObj}</tbody>
              </table>
            </div>
          </Col>
          <Col>
            <div style={{ marginBottom: "2px" }}>
              {
                <FormattedMessage
                  {...Messages.Text_WallSetting_ScreenDecoderPair}
                />
              }
            </div>
            <div
              style={{
                width: "225px",
                height: "279px",
                border: "1px solid black",
                overflowY: "scroll",
              }}
            >
              {screenList.map((screen, index) => {
                return (
                  <Row key={screen.num}>
                    <Typography.Text
                      style={{ fontSize: "14px", margin: "4px" }}
                    >
                      <FormattedMessage {...Messages.Text_Common_Screen} />
                      {screen.num}:
                    </Typography.Text>
                    <Select
                      options={decoderOptions}
                      size="small"
                      style={{ width: "135px", margin: "4px 4px 4px 8px" }}
                      onChange={(value, option) => {
                        setScreenDecoder({
                          screenNumber: screen.num,
                          decoder: value,
                        });
                      }}
                    />
                  </Row>
                );
              })}
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: "16px" }}>
          <Button onClick={resetWall} style={{ marginRight: "16px" }}>
            <FormattedMessage {...Messages.Text_WallSetting_ResetWall} />
          </Button>
          <Button onClick={saveWall}>
            <FormattedMessage {...Messages.Text_Button_Save} />
          </Button>
        </Row>
      </Modal>
    </div>
  );
};

export default CreateWall;
