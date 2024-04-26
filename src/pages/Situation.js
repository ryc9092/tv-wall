import React, { useContext, useEffect, useState } from "react";
import { Button, Card } from "antd";
import { StoreContext } from "../components/store/store";
import { DeleteOutlined } from "@ant-design/icons";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import CreateSituationModal from "../components/situation/createSituation";
import SituationContentModal from "../components/situation/situationContent";
import { getSituations, removeSituation, activateSituation } from "../api/API";
import "../App.scss";
import "./Situation.scss";

const Situation = () => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [situationCards, setSituationCards] = useState([]);
  const [situationActivated, setSituationActivated] = useState([]);
  const [reload, setReload] = useState(null);

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
        let cards = [];
        situations.forEach((situation) => {
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
              className="situation-card"
              extra={
                <Button type="text" id={situation.id} onClick={deleteSituation}>
                  <DeleteOutlined />
                </Button>
              }
            >
              <div style={{ marginLeft: 54, marginTop: 0 }}>
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
      }
    })();
  }, [reload]);

  const deleteSituation = async (event) => {
    const situationId = event.currentTarget.id;
    await removeSituation(situationId, store);
    setReload(Math.random());
  };

  return (
    <div>
      <div className="page-title">
        <FormattedMessage {...Messages.Text_Situation_Title} />
      </div>
      <div style={{ marginTop: 18 }}>
        <CreateSituationModal setReload={setReload} />
      </div>
      <div style={{ marginTop: 68 }}>{situationCards}</div>
    </div>
  );
};

export default Situation;
