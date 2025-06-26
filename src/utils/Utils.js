import { notification } from "antd";
import {
  ExclamationCircleFilled,
  InfoCircleFilled,
  CheckOutlined,
} from "@ant-design/icons";
import CheckIcon from "../assets/toast-check-icon.png";
import XIcon from "../assets/toast-x-icon.png";
import "./Utils.scss";

export const showWarningNotification = (warningMsg, messageKey) => {
  notification.error({
    // message: <span style={{color: "red"}}>{warningMsg}</span>,
    message: warningMsg,
    icon: (
      <img
        alt="x"
        src={XIcon}
        style={{
          width: 30,
          height: 30,
          marginTop: -4,
        }}
      />
    ),
    // icon: <ExclamationCircleFilled style={{ color: "#D12727" }} />,
    placement: "topRight",
    duration: 3,
    showProgress: true,
    pauseOnHover: true,
    style: {
      width: "500px",
      fontSize: "16px",
      borderRadius: "8px",
      // border: "1px solid #D12727",
      // backgroundColor: "#fceeee",
      backgroundColor: "#fff",
    },
    key: messageKey,
    onClick: () => {
      notification.destroy(messageKey);
    },
  });
};

export const showSuccessNotificationByMsg = (successMsg, messageKey) => {
  notification.success({
    message: successMsg,
    // icon: <InfoCircleFilled style={{ color: "green" }} />,
    // icon: <CheckOutlined style={{ color: "green", backgroundColor: "red", borderRadius: 8, padding: 6, fontSize: 16 }} />,
    icon: (
      <img
        alt="check"
        src={CheckIcon}
        style={{
          width: 32,
          height: 32,
          marginTop: -4,
        }}
      />
    ),
    placement: "topRight",
    duration: 3,
    showProgress: true,
    pauseOnHover: true,
    style: {
      width: "500px",
      fontSize: "16px",
      borderRadius: "8px",
      // border: "1px solid #3A84A7",
      // backgroundColor: "#faffdf",
      backgroundColor: "#fff",
    },
    key: messageKey,
    onClick: () => {
      notification.destroy(messageKey);
    },
  });
};

export const uuid = () => {
  var d = Date.now();
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    d += performance.now(); //use high-precision timer if available
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
