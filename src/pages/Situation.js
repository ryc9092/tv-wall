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
  const [reload, setReload] = useState(null);
  // const [situationActivated, setSituationActivated] = useState([]);
  const [situationCards, setSituationCards] = useState([]);
  const [expandSituation, setExpandSituation] = useState(null);
  const [expandSituationCard, setExpandSituationCard] = useState(null);
  const [situationItems, setSituationItems] = useState([]);

  // const startSituation = async (situationId) => {
  //   activateSituation(situationId, store).then(() => {
  //     setSituationActivated(
  //       situationActivated.filter((situation) => situation !== situationId)
  //     );
  //     setReload(Math.random());
  //   });
  //   setSituationActivated([situationId, ...situationActivated]);
  //   setReload(Math.random());
  // };

  const deleteSituation = async (event) => {
    const situationId = event.currentTarget.id;
    await removeSituation(situationId, store);
    setReload(Math.random());
  };

  const onClickExpand = async (clickedSituation, expandSituation) => {
    const situations = await getSituations(store);
    let detail = await getSituationDetails(store, clickedSituation.id);
    if (clickedSituation?.id !== expandSituation?.id) {
      // expand clicked situation
      setExpandSituation(clickedSituation);
      setExpandSituationCard(getSituationCard(clickedSituation, detail, true));

      // other situations
      let cards = [];
      situations?.forEach((situation) => {
        if (situation.id !== clickedSituation.id)
          cards.push(getSituationCard(situation, [], false));
      });
      setSituationCards(cards);
    }
  };

  // get situations on reload
  useEffect(() => {
    (async () => {
      const situations = await getSituations(store);

      if (situations) {
        let situation = situations[0];
        let situationDetail = await getSituationDetails(store, situation.id);
        setSituationItems(situationDetail);
        let expandCard = getSituationCard(situation, situationDetail, true);
        setExpandSituation(situation);
        setExpandSituationCard(expandCard);
      }

      let cards = [];
      situations?.forEach((situation, index) => {
        if (index !== 0) {
          cards.push(getSituationCard(situation, [], false));
        }
      });
      setSituationCards(cards);
    })();
  }, [reload]);

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

  const getSituationCard = (situation, situationDetail, expanded) => {
    if (situation) {
      return (
        <Card
          title={
            <div
              className={
                expanded
                  ? "situation-card-title-row-expanded"
                  : "situation-card-title-row-normal"
              }
            >
              <div className="situation-card-title">{situation.name}</div>
              <div>
                <Button
                  type="text"
                  className="situation-card-play-btn"
                  // disabled={situationActivated.includes(situation.id)}
                  // onClick={() => startSituation(situation.id)}
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
                  onClick={() => {
                    onClickExpand(situation, expandSituation);
                  }}
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
          className={
            expanded ? "situation-card-expanded" : "situation-card-normal"
          }
          // extra={
          //   <Button type="text" id={situation.id} onClick={deleteSituation}>
          //     <DeleteOutlined />
          //   </Button>
          // }
        >
          <div
            className={
              expanded
                ? "situation-card-content-expanded"
                : "situation-card-content-normal"
            }
          >
            <div className="situation-description">{situation.remark}</div>
            {expanded ? (
              <div>
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
                <Button type="text" id={situation.id} onClick={deleteSituation} className="delete-situation-btn">
                  <img
                    alt="remove"
                    src={TrashIcon}
                    className="table-content-icon"
                  />
                  <span className="delete-situation-btn-text"><FormattedMessage {...Messages.Text_Situation_RemoveSituation} /></span>
                </Button>
              </div>
            ) : null}
          </div>
        </Card>
      );
    } else return null;
  };

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
        <div>{expandSituationCard}</div>
        <div>{situationCards}</div>
        {/* <div>{situationCards}</div> */}
      </div>
    </div>
  );
};

export default Situation;
