import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Col, Row } from "antd";
import { getMonitor, setMonitorStatus } from "../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import {
  showWarningNotification,
  showSuccessNotificationByMsg,
} from "../utils/Utils";
import "./MonitorMgmt.scss";
import "../App.scss";

const MonitorMgmt = () => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [monitors, setMonitors] = useState([]);
  const [monitorCards, setMonitorCards] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await getMonitor(store);
      setMonitors(result);
      let tempMonitorCards = [];
      result?.forEach((monitor) => {
        let monitorCard = (
          <Col key={monitor.Name} className="monitor-card">
            <div className="monitor-cover">
              <span className="monitor-cover-text">{monitor.Name}</span>
              <span className="monitor-cover-text">{monitor.Ip}</span>
            </div>
            <div className="monitor-power-btn-line">
              <Button
                id={monitor.Ip}
                className="monitor-power-on-btn"
                onClick={(event) => {
                  const ip = event.currentTarget.id;
                  handlePowerOnOff(ip, "on");
                }}
              >
                <FormattedMessage {...Messages.Text_Common_On} />
              </Button>
              <Button
                id={monitor.Ip}
                className="monitor-power-off-btn"
                onClick={(event) => {
                  const ip = event.currentTarget.id;
                  handlePowerOnOff(ip, "off");
                }}
              >
                <FormattedMessage {...Messages.Text_Common_Off} />
              </Button>
            </div>
          </Col>
        );
        tempMonitorCards.push(monitorCard);
      });
      setMonitorCards(tempMonitorCards);
    })();
  }, [store]);

  const handlePowerOnOff = async (ip, status) => {
    let handleMonitor;
    monitors?.forEach((monitor) => {
      if (monitor.Ip === ip) handleMonitor = monitor;
    });
    if (handleMonitor) {
      let result = await setMonitorStatus({
        store: store,
        deviceType: handleMonitor.DeviceType,
        ip: handleMonitor.Ip,
        status: status,
      });
      if (result) {
        showSuccessNotificationByMsg(
          intl.formatMessage(Messages.Text_Common_OperationSuccess)
        );
      } else {
        showWarningNotification(
          intl.formatMessage(Messages.Text_Common_OperationFailed)
        );
      }
    }
  };

  return (
    <div className="monitor-layout">
      <div>
        <span className="page-title">
          <FormattedMessage {...Messages.Text_MonitorManagement_Title} />
        </span>
      </div>
      <div className="monitor-container">
        <Row gutter={0}>{monitorCards}</Row>
      </div>
    </div>
  );
};

export default MonitorMgmt;
