import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Table } from "antd";
import { StoreContext } from "../components/store/store";
import { DeleteOutlined } from "@ant-design/icons";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import CreateSituation from "../components/situation/createSituation";
import SituationContentModal from "../components/situation/situationContent";
import {
  getSituations,
  getSituationDetails,
  removeSituation,
  activateSituation,
} from "../api/API";
import PlayIcon from "../assets/play-black.png";
import CaretIcon from "../assets/caret-down.png";
import TrashIcon from "../assets/trash.png";
import PlusYellowIcon from "../assets/plus-yellow.png";
import "../App.scss";
import "./Situation.scss";

const Situation = () => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [situationCards, setSituationCards] = useState([]);
  const [situationActivated, setSituationActivated] = useState([]);
  const [reload, setReload] = useState(null);
  const [expandSituation, setExpandSituation] = useState(null);
  const [situationItems, setSituationItems] = useState([]);

  const startSituation = async (situationId) => {
    activateSituation(situationId, store).then(() => {
      setSituationActivated(
        situationActivated.filter((situation) => situation !== situationId)
      );
      setReload(Math.random());
    });
    setSituationActivated([situationId, ...situationActivated]);
    setReload(Math.random());
  };

  // get situations on reload
  useEffect(() => {
    (async () => {
      const situations = await getSituations(store);

      if (situations) {
        let situation = situations[0];
        console.log(situation, "!!!");
        let situationDetail = await getSituationDetails(store, situation.id);
        setSituationItems(situationDetail);
        console.log(situationDetail, "kdj;flskdjflk");
        let expandSituationCard = (
          <Card
            title={
              <div className="situation-card-title-row">
                <div className="situation-card-title">{situation.name}</div>
                <div>
                  <Button
                    type="text"
                    className="situation-card-play-btn"
                    onClick={() => startSituation(situation.id)}
                  >
                    <img
                      alt="play"
                      src={PlayIcon}
                      className="situation-card-play-icon"
                    />
                  </Button>
                  <Button
                    type="text"
                    className="situation-card-caret-btn"
                    onClick={() => {}}
                    style={{ marginLeft: 12 }}
                  >
                    <img
                      alt="caret"
                      src={CaretIcon}
                      className="situation-card-caret-icon"
                    />
                  </Button>
                </div>
              </div>
            }
            key={situation.id}
            className="situation-card-expanded"
            // extra={
            //   <Button type="text" id={situation.id} onClick={deleteSituation}>
            //     <DeleteOutlined />
            //   </Button>
            // }
          >
            <div className="situation-card-content">
              <div className="situation-description">{situation.remark}</div>
              <Table
                columns={columns}
                dataSource={situationDetail}
                className={
                  situationDetail.length === 0 ? "table-no-item" : null
                }
                pagination={false}
              />
              <Button
                type="text"
                className="add-situation-item-btn"
                onClick={() => {}}
              >
                <img
                  alt="create"
                  src={PlusYellowIcon}
                  className="add-situation-item-btn-icon"
                />
                <span className="add-situation-item-btn-text">
                  <FormattedMessage
                    {...Messages.Text_Situation_AddSituationItem}
                  />
                </span>
              </Button>
            </div>
          </Card>
        );
        setExpandSituation(expandSituationCard);
      }

      let cards = [];
      situations?.forEach((situation) => {
        cards.push(
          <Card
            title={
              <>
                <span style={{ marginRight: 10 }}>{situation.name}</span>{" "}
                <Button
                  disabled={situationActivated.includes(situation.id)}
                  onClick={() => startSituation(situation.id)}
                >
                  <FormattedMessage {...Messages.Text_Situation_Activate} />
                </Button>
              </>
            }
            key={situation.id}
            className="situation-card-normal"
            extra={
              <Button type="text" id={situation.id} onClick={deleteSituation}>
                <DeleteOutlined />
              </Button>
            }
          >
            <div>
              <SituationContentModal
                id={situation.id}
                name={situation.name}
                desc={situation.remark}
              />
            </div>
          </Card>
        );
      });
      setSituationCards(cards);
    })();
  }, [reload]);

  const deleteSituation = async (event) => {
    const situationId = event.currentTarget.id;
    await removeSituation(situationId, store);
    setReload(Math.random());
  };

  const columns = [
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_Situation_Type)}
        </span>
      ),
      dataIndex: "set_type",
      key: "type",
      render: (text) => <span className="table-content">{text}</span>,
    },
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_Common_Name)}
        </span>
      ),
      dataIndex: "id",
      key: "name",
      render: (text) => {
        return <span className="table-content">{text}</span>;
      },
    },
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_Common_Description)}
        </span>
      ),
      dataIndex: "remark",
      key: "description",
      render: (text) => {
        return <span className="table-content">{text}</span>;
      },
    },
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_Button_Operation)}
        </span>
      ),
      dataIndex: "id",
      key: "operate",
      render: (text, record) => {
        return (
          <div key={`${text}-action`}>
            <Button
              key={`${text}-delete`}
              id={text}
              type="text"
              onClick={() => {}}
              className="table-content"
            >
              <img
                alt="remove"
                src={TrashIcon}
                className="table-content-icon"
              />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="situation-title-layout">
        <div className="situation-title-row">
          <div className="page-title">
            <FormattedMessage {...Messages.Text_Situation_Title} />
          </div>
          <CreateSituation setReload={setReload} />
        </div>
      </div>
      <div className="situation-list-layout">
        <div>{expandSituation}</div>
        <div>{situationCards}</div>
        {/* <div>{situationCards}</div> */}
      </div>
    </div>
  );
};

export default Situation;
