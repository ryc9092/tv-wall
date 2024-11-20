import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/store/store";
import { Button, Col, Row, Table } from "antd";
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
  // const [monitorCards, setMonitorCards] = useState([]);

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

  useEffect(() => {
    // const handlePowerOnOff = async (ip, status, monitors) => {
    //   let handleMonitor;
    //   monitors?.forEach((monitor) => {
    //     if (monitor.Ip === ip) handleMonitor = monitor;
    //   });
    //   if (handleMonitor) {
    //     let result = await setMonitorStatus({
    //       store: store,
    //       deviceType: handleMonitor.DeviceType,
    //       ip: handleMonitor.Ip,
    //       status: status,
    //     });
    //     if (result) {
    //       showSuccessNotificationByMsg(
    //         intl.formatMessage(Messages.Text_Common_OperationSuccess)
    //       );
    //     } else {
    //       showWarningNotification(
    //         intl.formatMessage(Messages.Text_Common_OperationFailed)
    //       );
    //     }
    //   }
    // };

    (async () => {
      const monitors = await getMonitor(store);
      setMonitors(monitors);
      // let tempMonitorCards = [];
      // monitors?.forEach((monitor) => {
      //   let monitorCard = (
      //     <Col key={monitor.Name} className="monitor-card">
      //       <div className="monitor-cover">
      //         <span className="monitor-cover-text">{monitor.Name}</span>
      //         <span className="monitor-cover-text">{monitor.Ip}</span>
      //       </div>
      //       <div className="monitor-power-btn-line">
      //         <Button
      //           id={monitor.Ip}
      //           className="monitor-power-on-btn"
      //           onClick={(event) => {
      //             const ip = event.currentTarget.id;
      //             handlePowerOnOff(ip, "on", monitors);
      //           }}
      //         >
      //           <FormattedMessage {...Messages.Text_Common_On} />
      //         </Button>
      //         <Button
      //           id={monitor.Ip}
      //           className="monitor-power-off-btn"
      //           onClick={(event) => {
      //             const ip = event.currentTarget.id;
      //             handlePowerOnOff(ip, "off", monitors);
      //           }}
      //         >
      //           <FormattedMessage {...Messages.Text_Common_Off} />
      //         </Button>
      //       </div>
      //     </Col>
      //   );
      //   tempMonitorCards.push(monitorCard);
      // });
      // setMonitorCards(tempMonitorCards);
    })();
  }, [intl, store]);

  const columns = [
    {
      title: (
        <span className="table-head">
          {intl.formatMessage(Messages.Text_Common_Name)}
        </span>
      ),
      dataIndex: "Name",
      key: "Name",
      render: (text) => <span className="table-content">{text}</span>,
    },
    {
      title: <span className="table-head">IP</span>,
      dataIndex: "Ip",
      key: "Ip",
      render: (text) => <span className="table-content">{text}</span>,
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
              key={`${text}-on`}
              id={record.Ip}
              type="text"
              onClick={(event) => {
                const ip = event.currentTarget.id;
                handlePowerOnOff(ip, "on");
              }}
              className="table-content monitor-power-on-btn"
            >
              On
            </Button>
            <Button
              key={`${text}-off`}
              id={record.Ip}
              type="text"
              onClick={(event) => {
                const ip = event.currentTarget.id;
                handlePowerOnOff(ip, "off", monitors);
              }}
              className="table-content monitor-power-off-btn"
            >
              Off
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="monitor-layout">
      <div>
        <span className="page-title">
          <FormattedMessage {...Messages.Text_MonitorManagement_Title} />
        </span>
      </div>
      {/* <div className="monitor-container">
        <Row gutter={0}>{monitorCards}</Row>
      </div> */}
      <div className="monitor-content-container">
        <Table
          columns={columns}
          dataSource={monitors}
          pagination={{ pageSize: 10 }}
          rowKey={(record) => record.Ip}
        />
      </div>
    </div>
  );
};

export default MonitorMgmt;
