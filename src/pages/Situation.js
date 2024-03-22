import React from "react";
import { Card } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../messages";
import "../App.scss";

const Situation = () => {
  const intl = useIntl();

  return (
    <div>
      <div className="page-title">
        <FormattedMessage {...Messages.Text_Situation_Title} />
      </div>
      <Card onClick={console.log("click", Math.random())}>建立情境</Card>
    </div>
  );
};

export default Situation;
