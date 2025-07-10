import React, { useContext, useEffect, useState } from "react";
import { Button, DatePicker, Table } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import dayjs from "dayjs";
import "./Record.scss";
import "../App.scss";

const Record = () => {
  const intl = useIntl();
  const today = dayjs();

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const columns = [
    {
      title: <span className="table-head">date</span>,
      dataIndex: "date",
      key: "date",
      render: (text) => <span className="table-content"></span>,
    },
    {
      title: <span className="table-head">time</span>,
      dataIndex: "time",
      key: "time",
      render: (text) => <span className="table-content"></span>,
    },
    {
      title: <span className="table-head">content</span>,
      dataIndex: "content",
      key: "content",
      render: (text) => <span className="table-content"></span>,
    },
  ];

  return (
    <div className="record-layout">
      <div>
        <span className="page-title">
          <FormattedMessage {...Messages.Text_Record_Title} />
        </span>
      </div>
      <div
        style={{ marginTop: 24, marginBottom: 24, display: "flex", gap: 16 }}
      >
        <DatePicker
          onChange={onChange}
          defaultValue={today}
          style={{ height: 40, fontSize: 16 }}
        />
        <Button style={{ height: 40, fontSize: 16 }}>取得報表</Button>
      </div>
      <Table columns={columns} />
    </div>
  );
};

export default Record;
