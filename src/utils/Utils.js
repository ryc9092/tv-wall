import { notification } from "antd";
import { ExclamationCircleFilled, InfoCircleFilled } from "@ant-design/icons";

export const showWarningNotification = (warningMsg, messageKey) => {
  notification.error({
    message: warningMsg,
    // icon: <ExclamationCircleFilled style={{ color: "#D12727" }} />,
    placement: "topRight",
    duration: 3,
    showProgress: true,
    pauseOnHover: true,
    style: {
      // width: "500px",
      fontSize: "16px",
      borderRadius: "8px",
      // border: "1px solid #D12727",
      backgroundColor: "#fceeee",
    },
    key: messageKey,
    onClick: () => {
      notification.destroy(messageKey)
    },
  });
};

export const showSuccessNotificationByMsg = (successMsg, messageKey) => {
  notification.success({
    message: successMsg,
    // icon: <InfoCircleFilled style={{ color: "green" }} />,
    placement: "topRight",
    duration: 3,
    showProgress: true,
    pauseOnHover: true,
    style: {
      // width: "500px",
      fontSize: "16px",
      borderRadius: "8px",
      // border: "1px solid #3A84A7",
      backgroundColor: "#faffdf",
    },
    key: messageKey,
    onClick: () => {
      notification.destroy(messageKey)
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
