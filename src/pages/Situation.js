import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Dropdown, Table } from "antd";
import { StoreContext } from "../components/store/store";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import CreateSituation from "../components/situation/createSituation";
import {
  getSituations,
  getSituationDetails,
  removeSituation,
  activateSituation,
} from "../api/API";
import TVWallModal from "../components/situation/tvWallModal";
import PlayIcon from "../assets/play-black.png";
import PauseIcon from "../assets/pause.png";
import CaretIcon from "../assets/caret-down.png";
import TrashIcon from "../assets/trash.png";
import PlusYellowIcon from "../assets/plus-yellow.png";
import TVWallIcon from "../assets/tvWall.png";
import SingleScreenIcon from "../assets/screen.png";
import USBIcon from "../assets/usb.png";
import AudioIcon from "../assets/audio.png";
import "../App.scss";
import "./Situation.scss";

let situationActivatedList = []; // for set activate situation list immediately

const Situation = () => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [reload, setReload] = useState(null);
  const [situationCards, setSituationCards] = useState([]);
  const [expandSituation, setExpandSituation] = useState(null);
  const [expandSituationCard, setExpandSituationCard] = useState(null);
  const [situationItems, setSituationItems] = useState([]);
  const [situationActivated, setSituationActivated] = useState([]);

  const [isTVWallModalOpen, setIsTVWallModalOpen] = useState(false);

  const startSituation = async (situationId) => {
    activateSituation(situationId, store).then(() => {
      let idx = situationActivatedList.indexOf(situationId);
      situationActivatedList.splice(idx, 1);
      setSituationActivated(situationActivatedList);
      setReload(Math.random());
    });
    situationActivatedList.push(situationId);
    setSituationActivated([situationId, ...situationActivated]);
    setReload(Math.random());
  };

  const deleteSituation = async (event) => {
    const situationId = event.currentTarget.id;
    await removeSituation(situationId, store);
    setReload(Math.random());
  };

  const onClickExpand = async (clickedSituation, expandSituationId) => {
    const situations = await getSituations(store);
    let detail = await getSituationDetails(store, clickedSituation.id);
    if (clickedSituation?.id !== expandSituationId) {
      // expand clicked situation
      setExpandSituation(clickedSituation);
      setExpandSituationCard(
        getSituationCard(clickedSituation, detail, clickedSituation.id)
      );

      // other situations
      let cards = [];
      situations?.forEach((situation) => {
        if (situation.id !== clickedSituation.id)
          cards.push(getSituationCard(situation, [], clickedSituation.id));
      });
      setSituationCards(cards);
    }
  };

  // get situations on reload
  useEffect(() => {
    (async () => {
      const situations = await getSituations(store);
      let expandedSituationId = "";

      if (situations) {
        let firstSituation = situations[0];
        let expandedSituation = expandSituation
          ? expandSituation
          : firstSituation;

        expandedSituationId = expandedSituation.id;
        let situationDetail = await getSituationDetails(
          store,
          expandedSituation.id
        );
        setSituationItems(situationDetail);
        let expandCard = getSituationCard(
          expandedSituation,
          situationDetail,
          expandedSituationId
        );
        setExpandSituation(expandedSituation);
        setExpandSituationCard(expandCard);
      }

      let cards = [];
      if (expandSituation) {
        situations?.forEach((situation) => {
          if (expandSituation.id !== situation.id) {
            cards.push(getSituationCard(situation, [], expandedSituationId));
          }
        });
      } else {
        situations?.forEach((situation, index) => {
          if (index !== 0) {
            cards.push(getSituationCard(situation, [], expandedSituationId));
          }
        });
      }
      setSituationCards(cards);
    })();
  }, [reload]);

  const columns = [
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_Common_Type)}
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

  const handleMenuClick = (event) => {
    console.log(event, expandSituation);
    if (event.key === "tvwall") setIsTVWallModalOpen(true);
  };

  const items = [
    {
      label: (
        <span className="dropdown-menu-text">
          {intl.formatMessage(Messages.Text_Situation_TVWallConnection)}
        </span>
      ),
      key: "tvwall",
      icon: (
        <img src={TVWallIcon} alt="tvwall" className="dropdown-menu-icon" />
      ),
    },
    {
      label: (
        <span className="dropdown-menu-text">
          {intl.formatMessage(Messages.Text_Situation_SingleScreenConnection)}
        </span>
      ),
      key: "singlescreen",
      icon: (
        <img
          src={SingleScreenIcon}
          alt="singlescreen"
          className="dropdown-menu-icon"
        />
      ),
    },
    {
      label: (
        <span className="dropdown-menu-text">
          {intl.formatMessage(Messages.Text_Situation_USBConnection)}
        </span>
      ),
      key: "usb",
      icon: <img src={USBIcon} alt="usb" className="dropdown-menu-icon" />,
    },
    {
      label: (
        <span className="dropdown-menu-text">
          {intl.formatMessage(Messages.Text_Situation_AudioConnection)}
        </span>
      ),
      key: "audio",
      icon: <img src={AudioIcon} alt="audio" className="dropdown-menu-icon" />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const getSituationCard = (
    situation,
    situationDetail,
    expandedSituationId
  ) => {
    if (situation) {
      return (
        <Card
          title={
            <div
              className={
                situation.id === expandedSituationId
                  ? "situation-card-title-row-expanded"
                  : "situation-card-title-row-normal"
              }
            >
              <div className="situation-card-title">{situation.name}</div>
              <div>
                <Button
                  type="text"
                  className={
                    situationActivated.includes(situation.id)
                      ? "situation-card-pause-btn"
                      : "situation-card-play-btn"
                  }
                  disabled={situationActivated.includes(situation.id)}
                  onClick={() => startSituation(situation.id)}
                >
                  <img
                    alt="play"
                    src={
                      situationActivated.includes(situation.id)
                        ? PauseIcon
                        : PlayIcon
                    }
                    className="situation-card-play-icon"
                  />
                </Button>
                <Button
                  type="text"
                  className="situation-card-caret-btn"
                  onClick={() => {
                    onClickExpand(situation, expandedSituationId);
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
            situation.id === expandedSituationId
              ? "situation-card-expanded"
              : "situation-card-normal"
          }
        >
          <div
            className={
              situation.id === expandedSituationId
                ? "situation-card-content-expanded"
                : "situation-card-content-normal"
            }
          >
            <div className="situation-description">{situation.remark}</div>
            {situation.id === expandedSituationId ? (
              <div>
                <Table
                  columns={columns}
                  dataSource={situationDetail}
                  className={
                    situationDetail.length === 0 ? "table-no-item" : null
                  }
                  pagination={false}
                />
                <Dropdown
                  menu={menuProps}
                  trigger={["click"]}
                  className="dropdown-menu"
                >
                  <Button type="text" className="add-situation-item-btn">
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
                </Dropdown>
                <Button
                  type="text"
                  id={situation.id}
                  onClick={deleteSituation}
                  className="delete-situation-btn"
                >
                  <img
                    alt="remove"
                    src={TrashIcon}
                    className="table-content-icon"
                  />
                  <span className="delete-situation-btn-text">
                    <FormattedMessage
                      {...Messages.Text_Situation_RemoveSituation}
                    />
                  </span>
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
      </div>
      <TVWallModal
        situation={expandSituation}
        isModalOpen={isTVWallModalOpen}
        setIsModalOpen={setIsTVWallModalOpen}
      />
    </div>
  );
};

export default Situation;
